import { readFile, writeFile } from 'fs';
import { dataPath } from './util';

type Config = {
  periods: number;
};

type Teacher = {
  name: string;
  subjects: { [key: string]: number };
  classes: { [key: string]: number };
};

type Class = {
  name: string;
  block: number;
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
  config: Config = { periods: 9 };
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
    this.teachers.push({ name, subjects: {}, classes: {} });
  }
  addClass(name: string): void {
    let num = parseInt(name),
      block: number;

    if (Number.isNaN(num) || num <= 2) block = 0;
    else if (num < 9) block = 1;
    else block = 2;

    this.classes.push({ name, block });
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
    let len = this.timetable.length;
    this.timetable = this.timetable.filter(
      (e) => !(e.teacher === t && e.class === c && e.subject === s)
    );

    let i = this.teachers.find((val) => val.name == t);
    if (!i) return;

    if (len > this.timetable.length) {
      i.classes[c] != 1 ? i.classes[c]-- : delete i.classes[c];
      i.subjects[s] != 1 ? i.subjects[s]-- : delete i.subjects[s];
    }

    let cnt = 0;
    matrix.map((dayVector, day) => {
      dayVector.map((active, period) => {
        cnt += active;
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

    if (cnt) {
      i.subjects[s] ??= 0;
      i.subjects[s]++;
      i.classes[c] ??= 0;
      i.classes[c]++;
    }
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

  getSubstitutions(
    absent: string[],
    exclude: string[],
    curDay: number
  ): { subs: { [key: string]: string[] }; fails: string[] } {
    const helperClassBlock: { [key: string]: number } = {};
    for (let c of this.classes) helperClassBlock[c.name] = c.block;

    const remaining: (Teacher & {
      block: number;
      free: boolean[];
      used: boolean;
    })[] = [];
    const teacherMap: { [key: string]: number } = {};
    this.teachers.map((t) => {
      if (!absent.includes(t.name) && !exclude.includes(t.name)) {
        let b = -1;
        Object.keys(t.classes).map(
          (c) => (b = Math.max(b, helperClassBlock[c]))
        );
        teacherMap[t.name] = remaining.length;
        remaining.push({
          ...t,
          block: b,
          free: Array(this.config.periods).fill(true),
          used: false,
        });
      }
    });

    const todayTable = this.timetable.filter((e) => e.day == curDay);

    for (let e of todayTable)
      if (!absent.includes(e.teacher) && !exclude.includes(e.teacher))
        remaining[teacherMap[e.teacher]].free[e.period] = false;

    const subs: { [key: string]: string[] } = {};
    const fails: string[] = [];
    for (let e of todayTable) {
      if (!absent.includes(e.teacher)) continue;

      const choices = remaining.filter(
        (t) =>
          !t.used && t.free[e.period] && t.block === helperClassBlock[e.class]
      );

      if (choices.length === 0) {
        fails.push(
          `Unable to replace ${e.teacher} teaching ${e.subject} in class ${e.class} during ${e.period} period`
        );
        continue;
      }

      let choices2 = choices.filter((t) => e.subject in t.subjects);
      if (choices2.length === 0) {
        choices2 = choices.filter((t) => e.class in t.classes);
      }
      if (choices2.length === 0) {
        choices2 = choices;
      }

      const final = Math.floor(Math.random() * choices2.length);
      const id = teacherMap[choices2[final].name];

      remaining[id].used = true;
      subs[remaining[id].name] ??= Array(this.config.periods).fill('');
      subs[remaining[id].name][e.period] = e.class;
    }

    return { subs, fails };
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
