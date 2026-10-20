import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const EmployeeContext = createContext();

// Map obstacles matching office layout for collision avoidance
const OBSTACLES = [
  { x: 90, y: 90, w: 180, h: 50, label: 'Desk Cluster A' },
  { x: 340, y: 90, w: 180, h: 50, label: 'Desk Cluster B' },
  { x: 90, y: 200, w: 180, h: 50, label: 'Desk Cluster C' },
  { x: 340, y: 200, w: 180, h: 50, label: 'Desk Cluster D' },
  { x: 720, y: 110, w: 170, h: 110, label: 'Conference Table' },
  { x: 70, y: 400, w: 70, h: 50, label: 'Pod 1' },
  { x: 180, y: 400, w: 70, h: 50, label: 'Pod 2' },
  { x: 70, y: 510, w: 70, h: 50, label: 'Pod 3' },
  { x: 180, y: 510, w: 70, h: 50, label: 'Pod 4' },
  { x: 700, y: 400, w: 90, h: 90, label: 'Lounge Round Table' },
  { x: 840, y: 400, w: 90, h: 90, label: 'Coffee Bar Counter' },
];

// Pre-calculated safe coordinate anchors across zones
const SAFE_STARTING_SPOTS = [
  { x: 220, y: 150 }, // Engineering aisle 1
  { x: 470, y: 150 }, // Engineering aisle 2
  { x: 220, y: 260 }, // Engineering aisle south
  { x: 470, y: 260 }, // Engineering aisle south-east
  { x: 180, y: 320 }, // Focus pod entrance corridor
  { x: 450, y: 320 }, // Central open collaborative area
  { x: 620, y: 220 }, // Boardroom reception area
  { x: 620, y: 450 }, // Coffee Lounge greeting area
  { x: 780, y: 350 }, // Lounge casual talk area
  { x: 890, y: 520 }, // Coffee counter terrace
  { x: 300, y: 480 }, // Quiet garden promenade
  { x: 550, y: 120 }, // Eastern engineering terrace
  { x: 300, y: 380 }, // Lounge crossover path
  { x: 600, y: 540 }, // Southern relaxation corridor
  { x: 780, y: 240 }, // Executive boardroom seating
  { x: 850, y: 240 }, // Executive boardroom corner
  { x: 120, y: 320 }, // Deep focus pod approach
  { x: 530, y: 420 }, // Central hub transit
];

// Test if coordinates are within office bounds, outside obstacles, and separated from others
export function isPositionValid(x, y, existingPositions = [], buffer = 22) {
  const mapW = 1000;
  const mapH = 650;

  if (x - buffer < 25 || x + buffer > mapW - 25) return false;
  if (y - buffer < 25 || y + buffer > mapH - 25) return false;

  for (const obs of OBSTACLES) {
    if (
      x + buffer > obs.x &&
      x - buffer < obs.x + obs.w &&
      y + buffer > obs.y &&
      y - buffer < obs.y + obs.h
    ) {
      return false;
    }
  }

  for (const pos of existingPositions) {
    if (pos && Number.isFinite(pos.x) && Number.isFinite(pos.y)) {
      const dist = Math.hypot(x - pos.x, y - pos.y);
      if (dist < 42) return false; // Ensure distinct separate circle footprint
    }
  }

  return true;
}

// Find available space dynamically
export function findAvailableSpot(existingPositions = []) {
  // 1. Try safe predefined starting spots
  for (const spot of SAFE_STARTING_SPOTS) {
    if (isPositionValid(spot.x, spot.y, existingPositions)) {
      return { x: spot.x, y: spot.y };
    }
  }

  // 2. Systematic search through open floor space
  const step = 45;
  for (let y = 60; y < 600; y += step) {
    for (let x = 60; x < 940; x += step) {
      if (isPositionValid(x, y, existingPositions)) {
        return { x, y };
      }
    }
  }

  // 3. Fallback
  return { x: 500, y: 325 };
}

// Clean and separate any clumping / obstacle-overlapping employees from legacy storage
export function sanitizeEmployees(list) {
  if (!Array.isArray(list) || list.length === 0) return SEED_EMPLOYEES;
  const assigned = [];
  return list.map((emp, index) => {
    let x = Number(emp.x);
    let y = Number(emp.y);
    if (!Number.isFinite(x) || !Number.isFinite(y) || !isPositionValid(x, y, assigned)) {
      const spot = findAvailableSpot(assigned);
      x = spot.x;
      y = spot.y;
    }
    const cleanEmp = {
      ...emp,
      id: emp.id || `EMP-${String(index + 1).padStart(3, '0')}`,
      x,
      y,
    };
    assigned.push({ x, y });
    return cleanEmp;
  });
}

const SEED_EMPLOYEES = [
  {
    id: 'EMP-001',
    name: 'Alex Rivera',
    email: 'alex@proxispeak.com',
    department: 'Engineering',
    jobTitle: 'Principal Systems Architect',
    role: 'admin',
    avatarId: 'alex-dev',
    availability: 'Available',
    assignedOffice: 'Engineering Bay Alpha',
    dateJoined: '2024-03-12',
    x: 220,
    y: 150,
  },
  {
    id: 'EMP-002',
    name: 'Sarah Chen',
    email: 'sarah@proxispeak.com',
    department: 'Design',
    jobTitle: 'Lead Product Designer',
    role: 'employee',
    avatarId: 'sarah-design',
    availability: 'Available',
    assignedOffice: 'Design Studio',
    dateJoined: '2024-04-18',
    x: 470,
    y: 150,
  },
  {
    id: 'EMP-003',
    name: 'Marcus Vance',
    email: 'marcus@proxispeak.com',
    department: 'Product',
    jobTitle: 'VP of Product Management',
    role: 'admin',
    avatarId: 'marcus-lead',
    availability: 'Busy',
    assignedOffice: 'Executive Boardroom',
    dateJoined: '2023-11-05',
    x: 620,
    y: 220,
  },
  {
    id: 'EMP-004',
    name: 'Elena Rostova',
    email: 'elena@proxispeak.com',
    department: 'Analytics',
    jobTitle: 'Senior Data Scientist',
    role: 'employee',
    avatarId: 'elena-analyst',
    availability: 'Available',
    assignedOffice: 'Focus Pod 1',
    dateJoined: '2024-06-01',
    x: 180,
    y: 320,
  },
  {
    id: 'EMP-005',
    name: 'Kai Tanaka',
    email: 'kai@proxispeak.com',
    department: 'Engineering',
    jobTitle: 'Frontend Engineer',
    role: 'employee',
    avatarId: 'kai-creative',
    availability: 'Away',
    assignedOffice: 'Engineering Bay Alpha',
    dateJoined: '2024-08-14',
    x: 220,
    y: 260,
  },
  {
    id: 'EMP-006',
    name: 'Maya Patel',
    email: 'maya@proxispeak.com',
    department: 'Infrastructure',
    jobTitle: 'DevOps & SRE Engineer',
    role: 'employee',
    avatarId: 'maya-engineer',
    availability: 'Available',
    assignedOffice: 'Engineering Bay Alpha',
    dateJoined: '2024-09-02',
    x: 470,
    y: 260,
  },
  {
    id: 'EMP-007',
    name: 'Sam Wilson',
    email: 'sam@proxispeak.com',
    department: 'Marketing',
    jobTitle: 'Head of Growth Marketing',
    role: 'employee',
    avatarId: 'sam-marketing',
    availability: 'Offline',
    assignedOffice: 'Open Workspace HQ',
    dateJoined: '2024-10-10',
    x: 450,
    y: 320,
  },
  {
    id: 'EMP-008',
    name: 'Chloe Dubois',
    email: 'chloe@proxispeak.com',
    department: 'Operations',
    jobTitle: 'Customer Success Lead',
    role: 'employee',
    avatarId: 'chloe-support',
    availability: 'Available',
    assignedOffice: 'Coffee Lounge',
    dateJoined: '2024-11-20',
    x: 620,
    y: 450,
  },
];

export const EmployeeProvider = ({ children }) => {
  const { currentUser: authUser } = useAuth();
  const authToken = authUser?.token;
  const [employees, setEmployees] = useState(() => {
    try {
      const stored = localStorage.getItem('proxispeak_employees');
      if (stored) {
        const parsed = JSON.parse(stored);
        return sanitizeEmployees(parsed);
      }
      return SEED_EMPLOYEES;
    } catch {
      return SEED_EMPLOYEES;
    }
  });

  useEffect(() => {
    localStorage.setItem('proxispeak_employees', JSON.stringify(employees));
  }, [employees]);

  // Sync with backend if available
  useEffect(() => {
    const session = sessionStorage.getItem('proxispeak_user_session');
    if (!session) return;
    try {
      const user = JSON.parse(session);
      if (user?.token) {
        fetch('/api/employees', {
          headers: { Authorization: `Bearer ${user.token}` },
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data?.employees && data.employees.length > 0) {
              setEmployees(sanitizeEmployees(data.employees));
            }
          })
          .catch(() => {});
      }
    } catch {}
  }, [authToken]);

  // Add new employee with guaranteed unique ID and distinct, collision-free position
  const addEmployee = (empData) => {
    if (!empData.name?.trim()) throw new Error('Employee name is required.');
    if (!empData.email?.trim()) throw new Error('Employee email is required.');

    const normalizedEmail = empData.email.trim().toLowerCase();
    const exists = employees.some((e) => e.email.toLowerCase() === normalizedEmail);
    if (exists) {
      throw new Error('An employee with this email address already exists.');
    }

    // Determine highest existing ID number to guarantee stable uniqueness
    const maxNum = employees.reduce((max, emp) => {
      const match = emp.id?.match(/EMP-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 0);
    const uniqueId = `EMP-${String(maxNum + 1).padStart(3, '0')}`;

    // Available space placement
    const currentCoords = employees.map((e) => ({ x: e.x, y: e.y }));
    const validSpot = findAvailableSpot(currentCoords);

    const newEmp = {
      id: uniqueId,
      name: empData.name.trim(),
      email: normalizedEmail,
      department: empData.department || 'Engineering',
      jobTitle: empData.jobTitle || 'Software Engineer',
      role: empData.role || 'employee',
      avatarId: empData.avatarId || 'alex-dev',
      availability: empData.availability || 'Available',
      assignedOffice: empData.assignedOffice || 'Open Workspace HQ',
      dateJoined: new Date().toISOString().split('T')[0],
      x: validSpot.x,
      y: validSpot.y,
    };

    setEmployees((prev) => [newEmp, ...prev]);

    // Async backend persist
    try {
      const session = sessionStorage.getItem('proxispeak_user_session');
      if (session) {
        const user = JSON.parse(session);
        if (user?.token) {
          fetch('/api/employees', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(newEmp),
          }).catch(() => {});
        }
      }
    } catch {}

    return newEmp;
  };

  // Update existing employee without affecting other employees
  const updateEmployee = (id, updates) => {
    if (updates.email) {
      const normalizedEmail = updates.email.trim().toLowerCase();
      const exists = employees.some(
        (e) => e.id !== id && e.email.toLowerCase() === normalizedEmail
      );
      if (exists) {
        throw new Error('Another employee is already using this email address.');
      }
    }

    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp))
    );

    // Async backend update
    try {
      const session = sessionStorage.getItem('proxispeak_user_session');
      if (session) {
        const user = JSON.parse(session);
        if (user?.token) {
          fetch(`/api/employees/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(updates),
          }).catch(() => {});
        }
      }
    } catch {}
  };

  // Delete single employee without affecting other records
  const deleteEmployee = (id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));

    // Async backend delete
    try {
      const session = sessionStorage.getItem('proxispeak_user_session');
      if (session) {
        const user = JSON.parse(session);
        if (user?.token) {
          fetch(`/api/employees/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${user.token}` },
          }).catch(() => {});
        }
      }
    } catch {}
  };

  // Set availability status
  const setAvailability = (id, status) => {
    updateEmployee(id, { availability: status });
  };

  // Summary counts
  const summary = {
    total: employees.length,
    available: employees.filter((e) => e.availability === 'Available').length,
    busy: employees.filter((e) => e.availability === 'Busy').length,
    away: employees.filter((e) => e.availability === 'Away').length,
    offline: employees.filter((e) => e.availability === 'Offline').length,
    departments: Array.from(new Set(employees.map((e) => e.department))),
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        summary,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        setAvailability,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};
