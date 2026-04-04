import Navbar from "./components/ui/Navbar"
import Content from "./components/ui/Content"
import MainLayout from "./layouts/MainLayout"
import { DashboardProvider } from "./store/DashboardContext"

function App() {
  return (
    <DashboardProvider>
      <MainLayout>
        <Navbar />
        <Content />
      </MainLayout>
    </DashboardProvider>
  )
}

export default App
