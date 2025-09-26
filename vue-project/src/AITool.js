
import schoolDB from './Assets/school_DB.js'
const AITool = {
  getStudentInformationByName(studentName) {
    const student = schoolDB.students.find(s => s.student_id === studentId && s.name.toLowerCase().includes(studentName.toLowerCase()));
    return student ? student.info : null;
  },
  getStudentInformationById(studentId) {
    const student = schoolDB.students.find(s => s.student_id === studentId);
    return student ? student.info : null;
  },
};
const AIToolStudent = {
  getStudentInformationByName: AITool.getStudentInformationByName,
  getStudentInformationById: AITool.getStudentInformationById,
};
export const toolsList = [{ description: "Get Student Info by Name", func: AIToolStudent.getStudentInformationByName, name: "getStudentInformationByName" },
                           { description: "Get Student Info by ID", func: AIToolStudent.getStudentInformationById, name: "getStudentInformationById" }];
export default AIToolStudent;