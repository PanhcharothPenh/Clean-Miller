let app: any = null;
let loadError: any = null;

try {
  // Dynamically import the Express app from server.ts to catch any module load exceptions
  const serverModule = await import('../server');
  app = serverModule.default;
} catch (e: any) {
  loadError = {
    message: e.message || 'Unknown error during server.ts import',
    stack: e.stack || 'No stack trace available'
  };
}

export default function handler(req: any, res: any) {
  if (loadError) {
    res.status(500).json({
      error: 'Vercel Serverless Function Startup Crash',
      message: loadError.message,
      stack: loadError.stack
    });
    return;
  }
  
  if (!app) {
    res.status(500).json({
      error: 'Vercel Serverless Function Startup Crash',
      message: 'Express application instance is null or undefined.'
    });
    return;
  }

  return app(req, res);
}
