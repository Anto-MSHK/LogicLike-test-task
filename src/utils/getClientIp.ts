import { Request } from 'express';
import axios from 'axios';

function normalizeIp(ip: string): string {
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    return '127.0.0.1';
  }
  
  if (ip.startsWith('::ffff:')) {
    return ip.substring(7);
  }
  
  return ip;
}

function isValidIp(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

function isLocalhost(ip: string): boolean {
  return ip === '127.0.0.1' || ip === 'localhost' || ip === '::1';
}

let cachedGlobalIp: string | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 0.1 * 60 * 1000; // 10 seconds

/**
 * Fetches the server's global IP address from external service (ipify.org)
 * Used when client connects from localhost to get a real public IP for tracking.
 * Result is cached for 10 seconds to minimize external API calls.
 * 
 * @returns {Promise<string>} The global public IP address
 */
async function fetchGlobalIp(): Promise<string> {
  const now = Date.now();
  
  if (cachedGlobalIp && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedGlobalIp;
  }

  try {
    // External API call to ipify.org to get the server's public IP address
    const response = await axios.get('https://api.ipify.org?format=json', {
      timeout: 3000,
    });
    
    const fetchedIp = response.data.ip as string;
    cachedGlobalIp = fetchedIp;
    lastFetchTime = now;
    return fetchedIp;
  } catch (error) {
    console.warn('Failed to fetch global IP from external service, using fallback');
    return '0.0.0.0';
  }
}

export async function getClientIp(req: Request): Promise<string> {
  // Cloudflare
  const cfConnectingIp = req.headers['cf-connecting-ip'];
  if (cfConnectingIp && typeof cfConnectingIp === 'string') {
    const ip = normalizeIp(cfConnectingIp.trim());
    if (!isLocalhost(ip)) {
      return ip;
    }
  }

  // X-Real-IP (nginx)
  const realIp = req.headers['x-real-ip'];
  if (realIp && typeof realIp === 'string') {
    const ip = normalizeIp(realIp.trim());
    if (!isLocalhost(ip)) {
      return ip;
    }
  }

  // X-Forwarded-For (standard proxy header)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const forwardedIps = typeof forwarded === 'string' 
      ? forwarded.split(',') 
      : forwarded;
    
    const clientIp = forwardedIps[0].trim();
    if (isValidIp(clientIp)) {
      const ip = normalizeIp(clientIp);
      if (!isLocalhost(ip)) {
        return ip;
      }
    }
  }
  
  // Socket remote address
  const remoteAddress = req.socket.remoteAddress || 'unknown';
  const ip = normalizeIp(remoteAddress);
  
  // If client is on localhost, fetch the server's real global IP
  // by making an external API call to ipify.org
  if (isLocalhost(ip)) {
    return await fetchGlobalIp();
  }
  
  return ip;
}

