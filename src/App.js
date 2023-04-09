import { Route, Routes } from "react-router";
import ChooseUsername from "./components/ChooseUsername/ChooseUsername";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AddTurn from "./components/AddTurn/AddTurn";
import { AnimatePresence } from "framer-motion";
import UserSettings from "./components/UserSettings/UserSettings";
import { createContext, useState } from "react";

export const ThemeContext = createContext(null);

function App() {
	const [theme, setTheme] = useState("light");
	const toggleTheme = () =>
		setTheme((curr) => (curr === "light" ? "dark" : "light"));
	const data = { theme, toggleTheme };

	return (
		<ThemeContext.Provider value={data}>
			<AnimatePresence>
				<AuthProvider>
					<Routes>
						<Route
							path="/"
							element={
								<ProtectedRoute>
									<Home />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<Dashboard />
								</ProtectedRoute>
							}
						/>
						<Route path="/login" element={<Login />} />
						<Route
							path="dashboard/agregar-turno"
							element={
								<ProtectedRoute>
									<AddTurn />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/choose-username"
							element={
								<ProtectedRoute>
									<ChooseUsername />
								</ProtectedRoute>
							}
						/>
						<Route
							path="dashboard/settings"
							element={
								<ProtectedRoute>
									<UserSettings />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</AuthProvider>
			</AnimatePresence>
		</ThemeContext.Provider>
	);
}

export default App;
