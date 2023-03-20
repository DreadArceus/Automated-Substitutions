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

  validateTimetable(): string[] {
    const issues: string[] = [];

    const trackerT: {
      [key: string]: { day: number; period: number; c: string }[];
    } = {};
    const trackerC: {
      [key: string]: { day: number; period: number; t: string }[];
    } = {};
    for (const { teacher: t, class: c, day, period } of this.timetable) {
      trackerT[t] ??= [];
      trackerT[t].push({ day, period, c });
      trackerC[c] ??= [];
      trackerC[c].push({ day, period, t });
    }

    for (let i = 0; i < 6; i++)
      for (let j = 0; j < this.config.periods; j++) {
        for (const { name } of this.teachers) {
          if (!trackerT[name]) continue;

          const tmp = trackerT[name].filter(
            (e) => e.day === i && e.period === j
          );

          if (tmp.length > 1)
            issues.push(
              `Clash! ${name} has multiple classes on day ${i} in period ${j}: ${tmp
                .map((e) => e.c)
                .join(', ')}`
            );
        }

        for (const { name } of this.classes) {
          if (!trackerC[name]) continue;

          const tmp = trackerC[name].filter(
            (e) => e.day === i && e.period === j
          );

          if (tmp.length > 1)
            issues.push(
              `Clash! ${name} has multiple teachers on day ${i} in period ${j}: ${tmp
                .map((e) => e.t)
                .join(', ')}`
            );

          if (tmp.length === 0)
            issues.push(
              `Warning! Class ${name} is unassigned on day ${i} in period ${j}`
            );
        }
      }

    return issues;
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
