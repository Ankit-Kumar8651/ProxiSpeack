import React, { useState } from 'react';
import { useEmployees } from '../context/EmployeeContext';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/avatars/Avatar';
import { AvatarSelector } from '../components/avatars/AvatarSelector';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Mail,
  Building,
  Briefcase,
  Copy,
  Check,
  Shield,
  AlertTriangle,
  X,
  ExternalLink,
} from 'lucide-react';

export const EmployeesPage = () => {
  const { employees, summary, addEmployee, updateEmployee, deleteEmployee, setAvailability } =
    useEmployees();
  const { currentUser, isAdmin } = useAuth();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    jobTitle: '',
    role: 'employee',
    avatarId: 'alex-dev',
    availability: 'Available',
    assignedOffice: 'Engineering Bay Alpha',
  });
  const [formError, setFormError] = useState('');

  // Handle open Add Modal
  const openAddModal = () => {
    setFormData({
      name: '',
      email: '',
      department: 'Engineering',
      jobTitle: '',
      role: 'employee',
      avatarId: 'alex-dev',
      availability: 'Available',
      assignedOffice: 'Engineering Bay Alpha',
    });
    setFormError('');
    setShowAddModal(true);
  };

  // Handle open Edit Modal
  const openEditModal = (emp) => {
    setFormData({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      jobTitle: emp.jobTitle,
      role: emp.role,
      avatarId: emp.avatarId,
      availability: emp.availability,
      assignedOffice: emp.assignedOffice,
    });
    setFormError('');
    setEditingEmployee(emp);
  };

  // Handle Save (Add or Update)
  const handleSave = (e) => {
    e.preventDefault();
    setFormError('');

    try {
      if (editingEmployee) {
        updateEmployee(editingEmployee.id, formData);
        setEditingEmployee(null);
      } else {
        addEmployee(formData);
        setShowAddModal(false);
      }
    } catch (err) {
      setFormError(err.message || 'An error occurred while saving employee.');
    }
  };

  // Handle Delete Confirmation
  const confirmDelete = () => {
    if (deletingEmployee) {
      deleteEmployee(deletingEmployee.id);
      setDeletingEmployee(null);
    }
  };

  // Filter logic
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'ALL' || emp.availability === selectedStatus;
    const matchesRole = selectedRole === 'ALL' || emp.role === selectedRole;

    return matchesSearch && matchesDept && matchesStatus && matchesRole;
  });

  const copyInviteCode = () => {
    navigator.clipboard.writeText('PROXI-JOIN-7729X');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div style={{ padding: '2rem 0', flex: 1 }}>
      <div className="content-wrapper">
        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}
            >
              <Users color="var(--accent-primary)" size={28} />
              Employee Directory & Teams
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Manage team members, customize cartoon avatars, and assign virtual workspaces.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setShowInviteModal(true)}
              className="btn btn-secondary"
            >
              <Mail size={16} />
              Invite Team
            </button>
            {isAdmin && (
              <button onClick={openAddModal} className="btn btn-primary">
                <UserPlus size={16} />
                Add Employee
              </button>
            )}
          </div>
        </div>

        {/* Admin status pill if user is standard employee */}
        {!isAdmin && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--card-radius)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.85rem',
              color: '#F59E0B',
            }}
          >
            <Shield size={16} />
            <span>
              You are viewing the directory with <strong>Employee permissions</strong> (Read-Only). Log in as
              an Administrator to add, edit, or delete members.
            </span>
          </div>
        )}

        {/* Summary Metrics Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div className="ui-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL EMPLOYEES</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
              {summary.total}
            </div>
          </div>
          <div className="ui-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--status-available)', fontWeight: 600 }}>AVAILABLE NOW</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-available)', marginTop: 4 }}>
              {summary.available}
            </div>
          </div>
          <div className="ui-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--status-busy)', fontWeight: 600 }}>IN MEETINGS / BUSY</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-busy)', marginTop: 4 }}>
              {summary.busy}
            </div>
          </div>
          <div className="ui-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--status-away)', fontWeight: 600 }}>AWAY / IDLE</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-away)', marginTop: 4 }}>
              {summary.away}
            </div>
          </div>
          <div className="ui-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--status-offline)', fontWeight: 600 }}>OFFLINE</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-offline)', marginTop: 4 }}>
              {summary.offline}
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div
          className="ui-card"
          style={{
            padding: '1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Search box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 260 }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search
                size={18}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search by name, email, or job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          {/* Department Filter */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="form-select"
              style={{ width: 'auto' }}
            >
              <option value="ALL">All Departments</option>
              {summary.departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Availability Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-select"
              style={{ width: 'auto' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Away">Away</option>
              <option value="Offline">Offline</option>
            </select>

            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="form-select"
              style={{ width: 'auto' }}
            >
              <option value="ALL">All Roles</option>
              <option value="admin">Administrator</option>
              <option value="employee">Employee</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="ui-card desktop-table-wrapper" style={{ overflow: 'hidden', marginBottom: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>EMPLOYEE</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>DEPARTMENT</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>STATUS</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>ASSIGNED WORKSPACE</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>ROLE</th>
                {isAdmin && (
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>
                    ACTIONS
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No employees found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {/* Employee Info */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Avatar avatarId={emp.avatarId} size={42} availability={emp.availability} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            {emp.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {emp.jobTitle} • {emp.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.875rem' }}>
                      <span
                        style={{
                          background: 'var(--bg-tertiary)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                        }}
                      >
                        {emp.department}
                      </span>
                    </td>

                    {/* Availability */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`status-badge status-${emp.availability.toLowerCase()}`}>
                        <span className="status-dot" />
                        {emp.availability}
                      </span>
                    </td>

                    {/* Office */}
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {emp.assignedOffice}
                    </td>

                    {/* Role */}
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>
                      <span
                        style={{
                          color: emp.role === 'admin' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          fontWeight: emp.role === 'admin' ? 700 : 400,
                        }}
                      >
                        {emp.role === 'admin' ? 'Admin' : 'Member'}
                      </span>
                    </td>

                    {/* Actions */}
                    {isAdmin && (
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => openEditModal(emp)}
                            className="btn btn-secondary btn-sm"
                            title="Edit Employee"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeletingEmployee(emp)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--status-busy)' }}
                            title="Remove Employee"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="mobile-cards-wrapper" style={{ display: 'none', flexDirection: 'column', gap: '1rem' }}>
          {filteredEmployees.map((emp) => (
            <div key={emp.id} className="ui-card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Avatar avatarId={emp.avatarId} size={48} availability={emp.availability} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{emp.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{emp.jobTitle}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{emp.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.8rem' }}>
                <span className={`status-badge status-${emp.availability.toLowerCase()}`}>
                  <span className="status-dot" />
                  {emp.availability}
                </span>
                <span style={{ background: 'var(--bg-tertiary)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  {emp.department}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>{emp.assignedOffice}</span>
              </div>

              {isAdmin && (
                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <button onClick={() => openEditModal(emp)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => setDeletingEmployee(emp)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, color: 'var(--status-busy)' }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(showAddModal || editingEmployee) && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: 580, maxHeight: '90vh', overflowY: 'auto' }}>
            <div
              style={{
                padding: '1.25rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                {editingEmployee ? 'Edit Employee Details' : 'Add New Employee'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingEmployee(null);
                }}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem', borderRadius: '50%' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '1.25rem' }}>
              {formError && (
                <div
                  style={{
                    padding: '0.65rem 0.85rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid var(--status-busy)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--status-busy)',
                    fontSize: '0.85rem',
                    marginBottom: '1rem',
                  }}
                >
                  {formError}
                </div>
              )}

              {/* Cartoon Avatar Picker */}
              <div style={{ marginBottom: '1.25rem' }}>
                <AvatarSelector
                  selectedAvatarId={formData.avatarId}
                  onSelect={(id) => setFormData({ ...formData, avatarId: id })}
                  columns={4}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Alex Rivera"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    placeholder="alex@company.com"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="form-select"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Job Title</label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Frontend Engineer"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Availability Status</label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="form-select"
                  >
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="Away">Away</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Role & Permissions</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="form-select"
                  >
                    <option value="employee">Standard Employee</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Virtual Office</label>
                <input
                  type="text"
                  value={formData.assignedOffice}
                  onChange={(e) => setFormData({ ...formData, assignedOffice: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Engineering Bay Alpha"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingEmployee(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEmployee ? 'Save Changes' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingEmployee && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: 440, padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: 'var(--status-busy)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Remove Employee?</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  This will remove the employee from the virtual campus.
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Are you sure you want to remove <strong>{deletingEmployee.name}</strong> ({deletingEmployee.email})?
              This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setDeletingEmployee(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="btn btn-danger"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Team Modal */}
      {showInviteModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: 480, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Invite Team Members</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem', borderRadius: '50%' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Share this invite code or link with your colleagues to let them join your ProxiSpeak workspace:
            </p>

            <div className="form-group">
              <label className="form-label">Workspace Invite Code</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  readOnly
                  value="PROXI-JOIN-7729X"
                  className="form-input"
                  style={{ fontWeight: 700, letterSpacing: '0.05em' }}
                />
                <button onClick={copyInviteCode} className="btn btn-primary">
                  {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Direct Invite Link</label>
              <input
                type="text"
                readOnly
                value="https://proxispeak.app/signup?invite=PROXI-JOIN-7729X"
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="btn btn-secondary"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive layout styles for Table vs Mobile Cards */}
      <style>{`
        @media (max-width: 850px) {
          .desktop-table-wrapper { display: none !important; }
          .mobile-cards-wrapper { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default EmployeesPage;
