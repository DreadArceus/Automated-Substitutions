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
