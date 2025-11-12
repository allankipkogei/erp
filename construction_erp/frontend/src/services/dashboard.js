import api from "./api";

export const fetchDashboardStats = async () => {
  try {
    // Fetch real statistics from backend with error handling
    const results = await Promise.allSettled([
      api.get("/projects/"),
      api.get("/employees/"),
      api.get("/equipment/")
    ]);

    const [projectsRes, employeesRes, equipmentRes] = results;

    return {
      projects: projectsRes.status === 'fulfilled' 
        ? (projectsRes.value.data.count || projectsRes.value.data.results?.length || projectsRes.value.data.length || 0)
        : 0,
      employees: employeesRes.status === 'fulfilled'
        ? (employeesRes.value.data.count || employeesRes.value.data.results?.length || employeesRes.value.data.length || 0)
        : 0,
      equipments: equipmentRes.status === 'fulfilled'
        ? (equipmentRes.value.data.count || equipmentRes.value.data.results?.length || equipmentRes.value.data.length || 0)
        : 0
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    // Return zeros if all API calls fail
    return {
      projects: 0,
      employees: 0,
      equipments: 0
    };
  }
};
