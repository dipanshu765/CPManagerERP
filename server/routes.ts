import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Backend API configuration - change this to match your actual backend server
const BACKEND_BASE_URL = process.env.BACKEND_URL || "http://127.0.0.1:8096";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Log backend configuration on startup
  console.log(`[Backend Configuration] Using backend URL: ${BACKEND_BASE_URL}`);
  console.log(`[Backend Configuration] To change backend URL, set BACKEND_URL environment variable`);

  // Test endpoint to check backend connectivity
  app.get('/api/test-backend', async (req, res) => {
    try {
      const testUrl = `${BACKEND_BASE_URL}/`;
      console.log(`[Backend Test] Testing connection to: ${testUrl}`);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        timeout: 5000
      });
      
      res.json({
        status: 'success',
        backend_url: BACKEND_BASE_URL,
        backend_status: response.status,
        backend_accessible: true,
        message: 'Backend server is accessible'
      });
    } catch (error) {
      console.error(`[Backend Test] Failed to connect to ${BACKEND_BASE_URL}:`, error);
      res.status(503).json({
        status: 'error',
        backend_url: BACKEND_BASE_URL,
        backend_accessible: false,
        error: error.message,
        message: 'Backend server is not accessible. Please check if your backend server is running and accessible.'
      });
    }
  });

  // Proxy API routes for stock journal functionality
  // These proxy requests to your actual backend API server
  app.get('/api/get-stock-journals/', async (req, res) => {
    try {
      const authHeaders = req.headers.authorization ? { 'Authorization': req.headers.authorization } : {};
      const accessToken = req.headers.access_token;
      if (accessToken) {
        authHeaders['access_token'] = accessToken;
      }
      
      const queryParams = new URLSearchParams(req.query as Record<string, string>);
      const apiUrl = `${BACKEND_BASE_URL}/api/get-stock-journals/?${queryParams.toString()}`;
      console.log(`[Stock Journals] Attempting to fetch from: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        }
      });
      
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch stock journals' });
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error proxying stock journals request:', error);
      res.status(503).json({ 
        error: 'Backend API server not available',
        message: 'Please ensure your backend API server is running on http://127.0.0.1:8096',
        details: 'The stock journal API could not be reached. Please start your backend server.'
      });
    }
  });

  app.get('/api/get-voucher-types/', async (req, res) => {
    try {
      const authHeaders = req.headers.authorization ? { 'Authorization': req.headers.authorization } : {};
      const accessToken = req.headers.access_token;
      if (accessToken) {
        authHeaders['access_token'] = accessToken;
      }
      
      const queryParams = new URLSearchParams(req.query as Record<string, string>);
      const apiUrl = `${BACKEND_BASE_URL}/api/get-voucher-types/?${queryParams.toString()}`;
      console.log(`[Voucher Types] Attempting to fetch from: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        }
      });
      
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch voucher types' });
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error proxying voucher types request:', error);
      res.status(503).json({ 
        error: 'Backend API server not available',
        message: 'Please ensure your backend API server is running on http://127.0.0.1:8096'
      });
    }
  });

  app.get('/api/get-stock-journals-detail/:transactionId', async (req, res) => {
    try {
      const authHeaders = req.headers.authorization ? { 'Authorization': req.headers.authorization } : {};
      const accessToken = req.headers.access_token;
      if (accessToken) {
        authHeaders['access_token'] = accessToken;
      }
      
      const { transactionId } = req.params;
      const apiUrl = `${BACKEND_BASE_URL}/api/get-stock-journals-detail/${transactionId}/`;
      console.log(`[Stock Journal Details] Attempting to fetch from: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        }
      });
      
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch stock journal details' });
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error proxying stock journal details request:', error);
      res.status(503).json({ 
        error: 'Backend API server not available',
        message: 'Please ensure your backend API server is running on http://127.0.0.1:8096'
      });
    }
  });

  app.post('/api/process/sync-to-tally/', async (req, res) => {
    try {
      const authHeaders = req.headers.authorization ? { 'Authorization': req.headers.authorization } : {};
      const accessToken = req.headers.access_token;
      if (accessToken) {
        authHeaders['access_token'] = accessToken;
      }
      
      const apiUrl = `${BACKEND_BASE_URL}/api/process/sync-to-tally/`;
      console.log(`[Sync to Tally] Attempting to post to: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify(req.body)
      });
      
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to sync to Tally' });
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error proxying sync to Tally request:', error);
      res.status(503).json({ 
        error: 'Backend API server not available',
        message: 'Please ensure your backend API server is running on http://127.0.0.1:8096'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
