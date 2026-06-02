'use client';

import { useState, useEffect } from 'react';
import { Database, Search, Plus, Edit2, Trash2, Check, X, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function DatabasePage() {
  const [tables, setTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any | null>(null);
  const [rawJson, setRawJson] = useState<string>('');
  const [jsonError, setJsonError] = useState('');

  const fetchTables = async () => {
    try {
      setLoading(true);
      setError('');
      const list = await apiRequest('database/tables');
      setTables(list);
      if (list.length > 0) {
        setSelectedTable(list[0].name);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch system tables. Ensure local backend is running and connected.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTableData = async (tableName: string) => {
    if (!tableName) return;
    try {
      setLoading(true);
      setError('');
      const data = await apiRequest(`database/tables/${tableName}`);
      setTableData(data);
    } catch (err: any) {
      console.error(err);
      setError(`Failed to fetch data for table: ${tableName}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable);
    }
  }, [selectedTable]);

  const handleOpenCreate = () => {
    setEditingRow(null);
    // Create empty schema template based on existing data if possible
    const template: any = {};
    if (tableData.length > 0) {
      Object.keys(tableData[0]).forEach(key => {
        if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
          template[key] = '';
        }
      });
    } else {
      template.name = '';
    }
    setRawJson(JSON.stringify(template, null, 2));
    setJsonError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: any) => {
    setEditingRow(row);
    const editable = { ...row };
    delete editable.id;
    delete editable.created_at;
    delete editable.updated_at;
    setRawJson(JSON.stringify(editable, null, 2));
    setJsonError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record? This action is irreversible.')) {
      return;
    }
    try {
      setLoading(true);
      await apiRequest(`database/tables/${selectedTable}/${id}/delete`, {
        method: 'POST',
      });
      fetchTableData(selectedTable);
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setJsonError('');
      const parsedData = JSON.parse(rawJson);
      
      setLoading(true);
      if (editingRow) {
        // Edit mode
        await apiRequest(`database/tables/${selectedTable}/${editingRow.id}/update`, {
          method: 'POST',
          body: JSON.stringify(parsedData),
        });
      } else {
        // Create mode
        await apiRequest(`database/tables/${selectedTable}`, {
          method: 'POST',
          body: JSON.stringify(parsedData),
        });
      }
      setIsModalOpen(false);
      fetchTableData(selectedTable);
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON syntax');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = tableData.filter(row => {
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-500" />
            Database Table Explorer
          </h1>
          <p className="text-sm mt-1 theme-text-secondary">Read, edit, delete and seed records across all application service entities.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => fetchTableData(selectedTable)}
            className="flex items-center gap-2 px-4 py-2.5 theme-item-bg theme-item-hover border theme-border theme-text-secondary hover:theme-text-primary text-sm font-semibold rounded-xl transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/10 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Record
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Table Selector Sidebar */}
        <div className="lg:col-span-1 glass-panel rounded-3xl p-6 border theme-border space-y-4">
          <h2 className="text-sm font-bold theme-text-secondary uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4" />
            System Models
          </h2>
          <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
            {tables.map(t => (
              <button
                key={t.name}
                onClick={() => setSelectedTable(t.name)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${
                  selectedTable === t.name
                    ? 'bg-indigo-600 text-white font-semibold shadow-md'
                    : 'theme-text-secondary hover:theme-text-primary theme-item-hover'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table View Main area */}
        <div className="lg:col-span-3 glass-panel rounded-3xl overflow-hidden border theme-border">
          <div className="p-6 border-b theme-border bg-slate-100/50 dark:bg-[#0d1223]/30 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            <h2 className="text-lg font-bold theme-text-primary">
              {tables.find(t => t.name === selectedTable)?.label || 'No Table Selected'}
            </h2>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search table rows..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary placeholder-slate-500 w-64"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[600px]">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-20 theme-text-secondary">
                No records found.
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b theme-border bg-slate-100/20 dark:bg-[#090b16]/30 theme-text-secondary font-bold uppercase tracking-wider">
                    {Object.keys(filteredData[0]).map(key => (
                      <th key={key} className="px-4 py-3 whitespace-nowrap">{key}</th>
                    ))}
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y theme-border text-sm">
                  {filteredData.map((row, idx) => (
                    <tr key={row.id || idx} className="theme-item-hover transition-colors">
                      {Object.keys(row).map(key => {
                        const val = row[key];
                        return (
                          <td key={key} className="px-4 py-3 max-w-[200px] truncate theme-text-primary font-mono text-xs">
                            {val === null ? (
                              <span className="text-red-500/50">null</span>
                            ) : typeof val === 'object' ? (
                              JSON.stringify(val)
                            ) : (
                              String(val)
                            )}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(row)}
                            className="p-1.5 rounded-lg theme-item-bg border theme-border text-indigo-400 hover:text-indigo-500 hover:theme-item-hover transition-all"
                            title="Edit Record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="p-1.5 rounded-lg theme-item-bg border theme-border text-red-400 hover:text-red-500 hover:theme-item-hover transition-all"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* CRUD Overlay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden border theme-border shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b theme-border flex justify-between items-center bg-slate-100/50 dark:bg-[#0d1223]/30">
              <h3 className="text-lg font-bold theme-text-primary">
                {editingRow ? 'Modify Database Record' : 'Create Database Record'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-300 p-1 rounded-lg theme-item-hover"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {editingRow && (
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl text-xs font-mono">
                  Target Record ID: {editingRow.id}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold theme-text-secondary flex justify-between">
                  <span>Record JSON Data</span>
                  <span className="text-xs font-mono opacity-50">UTF-8 JSON Format</span>
                </label>
                <textarea
                  value={rawJson}
                  onChange={(e) => setRawJson(e.target.value)}
                  className="w-full h-[300px] p-4 font-mono text-xs theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 rounded-2xl theme-text-primary resize-none"
                  placeholder='{\n  "field": "value"\n}'
                />
              </div>

              {jsonError && (
                <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{jsonError}</span>
                </div>
              )}
            </div>

            <div className="p-6 border-t theme-border flex justify-end gap-3 bg-slate-100/50 dark:bg-[#0d1223]/30">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 theme-item-bg border theme-border theme-text-secondary hover:theme-text-primary font-semibold rounded-xl text-sm hover:theme-item-hover transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/10 transition-colors flex items-center gap-2"
              >
                {loading ? 'Saving...' : (
                  <>
                    <Check className="w-4 h-4" /> Save Record
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
