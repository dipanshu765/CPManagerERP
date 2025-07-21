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
  
  app.get('/api/get-stock-journals/', (req, res) => {
    // Mock data matching the API response format
    const mockData = {
      status: 200,
      data: [
        {
          transaction_id: "TR000029",
          voucher_type_name: "Sj Production [T]",
          voucher_number: "MUK014",
          remarks: "added",
          date: "21-07-2025",
          effective_date: "21-07-2025",
          is_tally_synced: true,
          created_at: "2025-07-21 11:58:48",
          updated_at: "2025-07-21 11:58:48"
        },
        {
          transaction_id: "TR000028",
          voucher_type_name: "Sj Production [T]",
          voucher_number: "MUK013",
          remarks: "production entry added",
          date: "21-07-2025",
          effective_date: "21-07-2025",
          is_tally_synced: false,
          created_at: "2025-07-21 11:51:55",
          updated_at: "2025-07-21 11:51:56"
        }
      ]
    };
    res.json(mockData);
  });

  app.get('/api/get-voucher-types/', (req, res) => {
    const mockData = {
      status: 200,
      data: [
        {
          id: 95,
          name: "Sj Consumption [R]",
          is_active: true,
          is_batch: false,
          add_bardan: true,
          in_source: false,
          in_destination: true,
          source_alias: "Raw Item",
          destination_alias: "Process Item",
          parent: "Stock Journal",
          created_at: "2025-07-16T10:51:09.740690"
        },
        {
          id: 99,
          name: "Sj Production [T]",
          is_active: true,
          is_batch: true,
          add_bardan: true,
          in_source: true,
          in_destination: false,
          source_alias: "Process Item",
          destination_alias: "Final Item",
          parent: "Stock Journal",
          created_at: "2025-07-16T10:51:09.873065"
        }
      ]
    };
    res.json(mockData);
  });

  app.get('/api/get-stock-journals-detail/:transactionId', (req, res) => {
    const mockData = {
      status: 200,
      data: {
        transaction_id: req.params.transactionId,
        voucher_type_name: "Sj Production [T]",
        voucher_number: "MUK014",
        remarks: "Production entry with detailed inventory",
        date: "21-07-2025",
        effective_date: "21-07-2025",
        is_tally_synced: true,
        destination_godown: "Godown No 1",
        inventory_entries_in: [
          {
            stock_item: "Process Gramdall Loose Rayapur [15.1.24]",
            actual_qty: {
              primary_qty: 250.0,
              primary_unit: "bags",
              secondary_qty: 250.0,
              secondary_unit: "qtl",
              full_text: "250.00 bags = 250.00 qtl"
            },
            batch_allocations: [
              {
                batch_name: "Primary",
                godown: "Godown No 1",
                destination_godown: "Godown No 1",
                actual_qty: {
                  primary_qty: 250.0,
                  primary_unit: "bags",
                  secondary_qty: 250.0,
                  secondary_unit: "qtl",
                  full_text: "250 bags = 250.0 qtl"
                }
              }
            ]
          }
        ],
        inventory_entries_out: [],
        created_at: "2025-07-21 11:58:48",
        updated_at: "2025-07-21 11:58:48"
      }
    };
    res.json(mockData);
  });

  app.post('/api/process/sync-to-tally/', (req, res) => {
    // Mock sync response
    const { transaction_id } = req.body;
    res.json({
      status: 200,
      message: `Transaction ${transaction_id} synced to Tally successfully`,
      data: { transaction_id, synced_at: new Date().toISOString() }
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
