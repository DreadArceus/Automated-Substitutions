import { readFile, writeFile } from 'fs';
import { dataPath } from './util';

type Config = {
  periods: number;
};

type Teacher = {
  name: string;
};

type Class = {
  name: string;
};

type Subject = {
  name: string;
};

type Entry = {
  teacher: string;
  class: string;
  subject: string;
  day: number;
  period: number;
};

type SaveData = {
  config: Config;
  teachers: Teacher[];
  classes: Class[];
  subjects: Subject[];
  timetable: Entry[];
};

export class Manager {
  config: Config = { periods: 0 };
  teachers: Teacher[] = [];
  classes: Class[] = [];
  subjects: Subject[] = [];
  timetable: Entry[] = [];

  constructor() {
    readFile(dataPath, 'utf-8', (err, rawData) => {
      if (!err) {
        const data: SaveData = JSON.parse(rawData);

        this.config = data.config;
        this.teachers = data.teachers;
        this.classes = data.classes;
        this.subjects = data.subjects;
        this.timetable = data.timetable;
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

  getConfig(): Config {
    return this.config;
  }
  updateConfig(neoConfig: Config): void {
    this.config = neoConfig;
  }

  getTCSEntries(t: string, c: string, s: string): number[][] {
    const matrix: number[][] = [];
    for (let i = 0; i < 6; i++)
      matrix.push(new Array(this.config.periods).fill(0));

    this.timetable.map((e) => {
      if (e.teacher === t && e.class === c && e.subject === s)
        matrix[e.day][e.period] = 1;
    });

    return matrix;
  }
  updateTimetable(t: string, c: string, s: string, matrix: number[][]): void {
    this.timetable = this.timetable.filter(
      (e) => !(e.teacher === t && e.class === c && e.subject === s)
    );

    matrix.map((dayVector, day) => {
      dayVector.map((active, period) => {
        if (active)
          this.timetable.push({
            teacher: t,
            class: c,
            subject: s,
            day,
            period,
          });
      });
    });
  }

  updateData(): void {
    const neoData: SaveData = {
      config: this.config,
      teachers: this.teachers,
      classes: this.classes,
      subjects: this.subjects,
      timetable: this.timetable,
    };

    writeFile(dataPath, JSON.stringify(neoData), (err) => {
      if (err) throw err;
    });
  }
}
