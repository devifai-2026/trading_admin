import api from './api';

export const getAllCourses = () => api.get('/courses');

export const getCourseById = (id) => api.get(`/courses/${id}`);

export const createCourse = (courseData) => {
  const formData = new FormData();
  formData.append('title', courseData.title);
  formData.append('url', courseData.url);
  formData.append('image', courseData.image);

  return api.post('/courses', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateCourse = (id, courseData) => {
  const formData = new FormData();
  if (courseData.title) formData.append('title', courseData.title);
  if (courseData.url) formData.append('url', courseData.url);
  if (courseData.image) formData.append('image', courseData.image);

  return api.put(`/courses/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteCourse = (id) => api.delete(`/courses/${id}`);
