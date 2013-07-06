#ifndef __Data_course__
#define __Data_course__

#include "general.hpp"
#include "major.hpp"
#include "id.hpp"
#include "gened.hpp"
using namespace std;

class Course {
protected: // variables
	ID id;
	string title;
	string description;
	
	vector<Major> majors;
	vector<Department> department;
	string concentrations;
	string conversations;
	string professor;
	
	int half_semester;
	bool pass_fail;
	float credits;
	string location;
	
	course_type_t courseType;
	vector<GenEd> geneds;
	
	bool days[7];
	float time[7];

protected: // methods
	void init(string identifier);
	void duplicate(const Course& c);

public:
	Course() {}
	Course(string str);
	Course(istream &is);
	Course(const Course &c);
	Course& operator= (const Course &c);

	friend bool operator== (const Course &c1, const Course &c2);
    friend bool operator!= (Course &c1, Course &c2);
	friend Course getCourse(string identifier);

	void cleanTitle();

	Department getDepartment(int i = 0);
	string getProfessor();
	ID getID();
	string getType();
	int getNumber();
	string getSection();

	ostream& getData(ostream& os);
	void display();
	void showAll();
};

extern vector<Course> all_courses;

ostream& operator<<(ostream& os, Course& item);
Course getCourse(string identifier);

#endif
