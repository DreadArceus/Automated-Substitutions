import { readFile, writeFile } from 'fs';
import { dataPath } from './util';

type Teacher = {
  name: string;
};

type Class = {
  name: string;
};

type Subject = {
  name: string;
};

type SaveData = {
  teachers: Teacher[];
  classes: Class[];
  subjects: Subject[];
};

export class Manager {
  teachers: Teacher[] = [];
  classes: Class[] = [];
  subjects: Subject[] = [];

  constructor() {
    readFile(dataPath, 'utf-8', (err, rawData) => {
      if (!err) {
        const data: SaveData = JSON.parse(rawData);
        console.log(data);

        this.teachers = data.teachers;
        this.classes = data.classes;
        this.subjects = data.subjects;
      }
    });
  }

  addTeacher(name: string): void {
    this.teachers.push({ name });
  }
  addClass(name: string): void {
    this.classes.push({ name });
  }
  addSubject(name: string): void {
    this.subjects.push({ name });
  }

  getTeachers(): string[] {
    return this.teachers.map((t) => t.name);
  }
  getClasses(): string[] {
    return this.classes.map((c) => c.name);
  }
  getSubjects(): string[] {
    return this.subjects.map((s) => s.name);
  }

  deleteTeacher(toDelete: string): void {
    this.teachers = this.teachers.filter((t) => t.name !== toDelete);
  }
  deleteClass(toDelete: string): void {
    this.classes = this.classes.filter((c) => c.name !== toDelete);
  }
  deleteSubject(toDelete: string): void {
    this.subjects = this.subjects.filter((s) => s.name !== toDelete);
  }

  updateData(): void {
    const neoData: SaveData = {
      teachers: this.teachers,
      classes: this.classes,
      subjects: this.subjects,
    };

    writeFile(dataPath, JSON.stringify(neoData), (err) => {
      if (err) throw err;
    });
  }
}
