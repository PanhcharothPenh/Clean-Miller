# Spring Boot Backend Code Structure & API Setup

This reference architecture implements the backend REST APIs for the **Clean24 Laundry Multi-Branch Management System** using **Java 17, Spring Boot 3.x, Hibernate (JPA), and Spring Security with JWT**.

Our design strictly enforces **multi-branch data separation** at the business/service layer. This prevents a user (Manager/Staff) at Toul Kork Branch from viewing or modifying transactions at Boeung Keng Kang.

---

## 1. Project Directory Layout

```text
clean24-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── clean24/
│   │   │           └── laundry/
│   │   │               ├── LaundryApplication.java
│   │   │               ├── config/
│   │   │               │   ├── SecurityConfig.java
│   │   │               │   ├── JwtAuthenticationFilter.java
│   │   │               │   └── WebMvcConfig.java
│   │   │               ├── controller/
│   │   │               │   ├── AuthController.java
│   │   │               │   ├── BranchController.java
│   │   │               │   ├── StaffController.java
│   │   │               │   ├── DailyIncomeController.java
│   │   │               │   ├── ExpenseController.java
│   │   │               │   ├── InventoryController.java
│   │   │               │   ├── MachineController.java
│   │   │               │   └── ReportController.java
│   │   │               ├── repository/
│   │   │               │   ├── BranchRepository.java
│   │   │               │   ├── StaffRepository.java
│   │   │               │   ├── IncomeRepository.java
│   │   │               │   └── UserRepository.java
│   │   │               ├── model/
│   │   │               │   ├── Branch.java
│   │   │               │   ├── User.java
│   │   │               │   ├── Role.java
│   │   │               │   ├── Staff.java
│   │   │               │   └── Income.java
│   │   │               ├── service/
│   │   │               │   ├── AuthService.java
│   │   │               │   ├── BranchService.java
│   │   │               │   ├── IncomeService.java
│   │   │               │   └── SecurityAuditorService.java
│   │   │               └── exception/
│   │   │                   ├── BranchAccessDeniedException.java
│   │   │                   └── GlobalExceptionHandler.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── db/
│   │           └── migration/
│   │               └── V1__init_schema.sql
```

---

## 2. Dynamic Separation Security Context

Here is the helper method used in all controller routes to validate that the request matches the user’s authorized branches:

```java
package com.clean24.laundry.service;

import com.clean24.laundry.model.User;
import com.clean24.laundry.exception.BranchAccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class SecurityAuditorService {

    /**
     * Asserts that the authenticated user is allowed to access and modify data 
     * associated with a specific branchId.
     */
    public void validateBranchAccess(String branchId) {
        User currentUser = (User) SecurityContextHolder.getContext()
                                                      .getAuthentication()
                                                      .getPrincipal();

        // 1. Owners have unrestricted full access across all branches
        if ("Owner".equals(currentUser.getRole().getName())) {
            return; 
        }

        // 2. Admins/Managers/Staff must only access assigned branches
        boolean isAssigned = currentUser.getAssignedBranches().stream()
                .anyMatch(branch -> branch.getId().equals(branchId));

        if (!isAssigned) {
            throw new BranchAccessDeniedException(
                "Access Denied: You do not have permissions for branch ID: " + branchId
            );
        }
    }
}
```

---

## 3. Daily Income REST Endpoint Example

```java
package com.clean24.laundry.controller;

import com.clean24.laundry.model.Income;
import com.clean24.laundry.service.IncomeService;
import com.clean24.laundry.service.SecurityAuditorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incomes")
@CrossOrigin(origins = "*")
public class DailyIncomeController {

    @Autowired
    private IncomeService incomeService;

    @Autowired
    private SecurityAuditorService securityService;

    // GET Incomes by Branch ID (Supports Strict Branch Separation)
    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<Income>> getIncomesByBranch(@PathVariable String branchId) {
        // Enforce security
        securityService.validateBranchAccess(branchId);
        
        List<Income> incomes = incomeService.findByBranchId(branchId);
        return ResponseEntity.ok(incomes);
    }

    // POST New Income
    @PostMapping("/branch/{branchId}")
    public ResponseEntity<Income> addIncome(@PathVariable String branchId, @RequestBody Income income) {
        // Enforce security
        securityService.validateBranchAccess(branchId);
        
        income.setBranchId(branchId);
        Income savedIncome = incomeService.save(income);
        return ResponseEntity.ok(savedIncome);
    }
}
```

---

## 4. JPA Query-Level Guarding

To automatically avoid developer mistakes, we can configure Hibernate's `@FilterDef` and `@Filter` annotations on branch-related records to automatically append a `branch_id = :branchId` constraint during active sessions.

```java
package com.clean24.laundry.model;

import jakarta.persistence.*;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import java.math.BigDecimal;

@Entity
@Table(name = "income")
@FilterDef(name = "branchFilter", parameters = @ParamDef(name = "branchId", type = String.class))
@Filter(name = "branchFilter", condition = "branch_id = :branchId")
public class Income {

    @Id
    private String id;

    @Column(name = "branch_id", nullable = false)
    private String branchId;

    @Column(name = "service_type")
    private String serviceType;

    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal discount;

    @Column(name = "total_amount", insertable = false, updatable = false)
    private BigDecimal totalAmount;

    // Getters and Setters ...
}
```

---

## 5. Deployment Guide for Cambodian Server Environments

### Setup Steps
1. **Database Provisoning**: Import `/docs/db_schema.sql` into a MySQL 8 server.
2. **Setup Spring Properties (`application.yml`)**:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/clean24_laundry_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
       username: clean24_user
       password: strong_password
     jpa:
       hibernate:
         ddl-auto: validate
       show-sql: true
   ```
3. **Execute Jar Package Compilation**:
   ```bash
   mvn clean package
   ```
4. **Deploy Application Container (Cloud Run/VPS)**:
   ```dockerfile
   FROM openjdk:17-jdk-slim
   COPY target/clean24-laundry-0.0.1-SNAPSHOT.jar app.jar
   ENTRYPOINT ["java", "-jar", "/app.jar"]
   ```
