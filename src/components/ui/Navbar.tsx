import { PiMagnifyingGlass, PiMoon, PiCaretDown } from 'react-icons/pi';
import { useDashboard } from '../../store/DashboardContext';

function Navbar() {
  const { role, setRole } = useDashboard();

  return (
    <header className="h-[60px] bg-bg-surface border-b border-border-subtle flex items-center justify-between px-6 sticky top-0 z-10 transition-colors duration-200">
      {/* Left side: Logo */}
      <div className="flex items-center">
        <h1 className="text-text-primary text-xl font-semibold tracking-tight">FinDash</h1>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-6">

        {/* Role Toggle */}
        <div className="relative group cursor-pointer flex items-center gap-2 hover:bg-bg-base py-1 px-2 rounded-md transition-colors">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${role === 'Admin' ? 'bg-accent-blue-light text-accent-blue' : 'bg-success-light text-success'
            }`}>
            {role === 'Admin' ? 'A' : 'V'}
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'Admin' | 'Viewer')}
            className="appearance-none bg-transparent text-sm font-medium text-text-primary hidden md:block cursor-pointer outline-none pr-4"
          >
            <option value="Admin">Admin</option>
            <option value="Viewer">Viewer</option>
          </select>
          <PiCaretDown className="w-3 h-3 text-text-muted absolute right-2 pointer-events-none hidden md:block" />
        </div>

        <button className="text-text-secondary hover:text-text-primary transition-colors p-1.5 rounded-md hover:bg-bg-base">
          <PiMoon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

export default Navbar;