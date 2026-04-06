import { HugeiconsIcon } from '@hugeicons/react'
import { Download01Icon, MoonIcon, SunIcon } from '@hugeicons/core-free-icons'
import { useDashboard } from '@/store/dashboard-store'
import { exportTransactionsCsv } from '@/features/transactions/utils/export-csv'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

export default function TopBar() {
  const { role, setRole, theme, toggleTheme, transactions } = useDashboard()

  return (
    <header className="h-14 bg-background/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 transition-all duration-300">
      <div
        className="text-lg tracking-widest font-extralight text-foreground/80 hover:text-foreground transition-all duration-300 hover:tracking-[0.2em] select-none cursor-default uppercase"
      >
        fin<span className="font-medium">dash</span>
      </div>

      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="rounded-full" onClick={() => exportTransactionsCsv(transactions)}>
              <HugeiconsIcon icon={Download01Icon} size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export to CSV</p>
          </TooltipContent>
        </Tooltip>

        <div className="flex items-center bg-muted/50 rounded-full p-0.5 gap-0.5">
          <button
            onClick={() => setRole('Admin')}
            className={cn(
              'px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300',
              role === 'Admin'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Admin
          </button>
          <button
            onClick={() => setRole('Viewer')}
            className={cn(
              'px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300',
              role === 'Viewer'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Viewer
          </button>
        </div>

<Tooltip>
          <TooltipTrigger asChild>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-muted/60 transition-all duration-300 text-muted-foreground hover:text-foreground hover:rotate-12"
          aria-label="Toggle theme"
        >
          <HugeiconsIcon
            icon={theme === 'light' ? MoonIcon : SunIcon}
            size={16}
            color="currentColor"
          />
        </button>
        </TooltipTrigger>
         <TooltipContent>
            <p>Switch to {theme === 'light' ? 'dark' : 'light'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
}
