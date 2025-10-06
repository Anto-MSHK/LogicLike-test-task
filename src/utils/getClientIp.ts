import { Request } from 'express';

export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  
  if (forwarded) {
    const forwardedIps = typeof forwarded === 'string' 
      ? forwarded.split(',') 
      : forwarded;
    return forwardedIps[0].trim();
  }
  
  return req.socket.remoteAddress || 'unknown';
}

