const API_URL = 'http://localhost:3000/api';

const API_ENDPOINTS = {
    // Auth APIs
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/auth/register`,
    FORGOT_PASSWORD: `${API_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_URL}/auth/reset-password`,
    
    // User APIs
    GET_PROFILE: `${API_URL}/users/me`,
    UPDATE_PROFILE: `${API_URL}/users`,
    CHANGE_PASSWORD: `${API_URL}/users/change-password`,
    
    // Course APIs
    GET_COURSES: `${API_URL}/courses`,
    GET_COURSE_DETAIL: (id) => `${API_URL}/courses/${id}`,
    CREATE_COURSE: `${API_URL}/courses`,
    UPDATE_COURSE: (id) => `${API_URL}/courses/${id}`,
    DELETE_COURSE: (id) => `${API_URL}/courses/${id}`,
    ENROLL_COURSE: (id) => `${API_URL}/courses/${id}/enroll`,
    
    // Exam APIs
    GET_EXAMS: `${API_URL}/exams`,
    GET_EXAM_DETAIL: (id) => `${API_URL}/exams/${id}`,
    CREATE_EXAM: `${API_URL}/exams`,
    UPDATE_EXAM: (id) => `${API_URL}/exams/${id}`,
    DELETE_EXAM: (id) => `${API_URL}/exams/${id}`,
    SUBMIT_EXAM: (id) => `${API_URL}/exams/${id}/submit`,
    
    // Category APIs
    GET_CATEGORIES: `${API_URL}/categories`,
    GET_CATEGORY_DETAIL: (id) => `${API_URL}/categories/${id}`,
    CREATE_CATEGORY: `${API_URL}/categories`,
    UPDATE_CATEGORY: (id) => `${API_URL}/categories/${id}`,
    DELETE_CATEGORY: (id) => `${API_URL}/categories/${id}`
}; 