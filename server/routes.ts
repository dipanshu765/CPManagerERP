import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Mock API routes for stock journal functionality
  // These should be replaced with actual API endpoints
  
  // Proxy API routes to external backend
  app.get('/api/get-stock-journals/', async (req, res) => {
    try {
      const authHeaders = req.headers.authorization ? { 'Authorization': req.headers.authorization } : {};
      const accessToken = req.headers.access_token;
      if (accessToken) {
        authHeaders['access_token'] = accessToken;
      }
      
      const queryParams = new URLSearchParams(req.query);
      const apiUrl = `http://127.0.0.1:8096/api/get-stock-journals/?${queryParams.toString()}`;
      
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
      
      const queryParams = new URLSearchParams(req.query);
      const apiUrl = `http://127.0.0.1:8096/api/get-voucher-types/?${queryParams.toString()}`;
      
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
      const apiUrl = `http://127.0.0.1:8096/api/get-stock-journals-detail/${transactionId}/`;
      
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
      
      const apiUrl = `http://127.0.0.1:8096/api/process/sync-to-tally/`;
      
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
