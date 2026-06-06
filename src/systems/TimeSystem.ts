// ============================================================
// 余晖谷 Embervale - 时间系统
// ============================================================

import {
  TIME_SPEED, DAY_START_HOUR, DAY_END_HOUR,
  DAYS_PER_SEASON, SEASON_CONFIG, STAMINA_REGEN_PER_HOUR,
} from '../config/game';
import { Season, Weather } from '../types';
import type { GameTime } from '../types';

export class TimeSystem {
  public time: GameTime;
  public timeSpeed: number = TIME_SPEED;
  public isPaused: boolean = false;
  public currentWeather: Weather = Weather.SUNNY;

  // 回调
  public onDayStart?: () => void;
  public onDayEnd?: () => void;
  public onSeasonChange?: (newSeason: Season) => void;
  public onHourChange?: (hour: number) => void;
  public onWeatherChange?: (weather: Weather) => void;

  // 累计时间
  private accumulatedMs: number = 0;
  private weatherTimer: number = 0;
  private weatherChangeInterval: number = 180; // 每3分钟可能换天气

  constructor() {
    this.time = {
      year: 1,
      season: Season.SPRING,
      day: 1,
      hour: DAY_START_HOUR,
      minute: 0,
    };
  }

  // ========== 更新（每帧调用） ==========

  update(delta: number): void {
    if (this.isPaused) return;

    this.accumulatedMs += delta * this.timeSpeed;

    // 每500ms现实时间 = 1游戏分钟（timeSpeed=0.5时）
    const minuteStep = 500;
    let minutesChanged = false;

    while (this.accumulatedMs >= minuteStep) {
      this.accumulatedMs -= minuteStep;
      this.advanceMinute();
      minutesChanged = true;
    }

    // 天气更新
    if (minutesChanged) {
      this.updateWeather(delta);
    }
  }

  // ========== 分钟推进 ==========

  private advanceMinute(): void {
    const oldHour = this.time.hour;

    this.time.minute += 10; // 每10游戏分钟跳一次（显示友好）

    if (this.time.minute >= 60) {
      this.time.minute = 0;
      this.time.hour += 1;
    }

    // 小时变化
    if (this.time.hour !== oldHour) {
      // 每整点恢复体力
      this.onHourChange?.(this.time.hour);
    }

    // 凌晨2点强制睡觉
    if (this.time.hour >= DAY_END_HOUR) {
      this.endDay();
    }
  }

  // ========== 日切换 ==========

  private endDay(): void {
    this.time.hour = DAY_START_HOUR;
    this.time.minute = 0;
    this.time.day += 1;

    // 体力恢复
    this.onDayEnd?.();

    // 季节切换
    if (this.time.day > DAYS_PER_SEASON) {
      this.time.day = 1;
      this.advanceSeason();
    }

    // 新一天开始
    this.onDayStart?.();
  }

  private advanceSeason(): void {
    const seasons = [Season.SPRING, Season.SUMMER, Season.AUTUMN, Season.WINTER];
    const currentIndex = seasons.indexOf(this.time.season);
    const nextIndex = (currentIndex + 1) % seasons.length;

    if (nextIndex === 0) {
      this.time.year += 1;
    }

    this.time.season = seasons[nextIndex];
    this.onSeasonChange?.(this.time.season);
  }

  // ========== 天气 ==========

  private updateWeather(delta: number): void {
    this.weatherTimer += delta;

    if (this.weatherTimer >= this.weatherChangeInterval * 1000) {
      this.weatherTimer = 0;
      this.rollWeather();
    }
  }

  private rollWeather(): void {
    const config = SEASON_CONFIG[this.time.season];
    const roll = Math.random();
    let cumulative = 0;
    let newWeather = Weather.SUNNY;

    for (const [weather, weight] of Object.entries(config.weatherWeights)) {
      cumulative += weight;
      if (roll <= cumulative) {
        newWeather = weather as Weather;
        break;
      }
    }

    // 不会连续两天暴风雨
    if (newWeather === Weather.STORMY && this.currentWeather === Weather.STORMY) {
      return;
    }

    if (newWeather !== this.currentWeather) {
      this.currentWeather = newWeather;
      this.onWeatherChange?.(newWeather);
    }
  }

  // ========== 查询 ==========

  getHoursElapsedSince(hour: number, minute: number): number {
    const currentMinutes = this.time.hour * 60 + this.time.minute;
    const targetMinutes = hour * 60 + minute;
    return (currentMinutes - targetMinutes) / 60;
  }

  getDayProgress(): number {
    const totalMinutes = (DAY_END_HOUR - DAY_START_HOUR) * 60;
    const currentMinutes = (this.time.hour - DAY_START_HOUR) * 60 + this.time.minute;
    return currentMinutes / totalMinutes;
  }

  getSeasonProgress(): number {
    return (this.time.day - 1) / DAYS_PER_SEASON;
  }

  formatTime(): string {
    const displayHour = this.time.hour <= 24 ? this.time.hour : this.time.hour - 24;
    const period = this.time.hour < 12 ? 'AM' : this.time.hour < 24 ? 'PM' : 'AM';
    const h = String(displayHour === 0 ? 12 : displayHour).padStart(2, '0');
    const m = String(this.time.minute).padStart(2, '0');
    return `${h}:${m} ${period}`;
  }

  formatDate(): string {
    const config = SEASON_CONFIG[this.time.season];
    return `${config.name} · 第${this.time.day}天 · 第${this.time.year}年`;
  }

  // ========== 控制 ==========

  setTimeSpeed(speed: number): void {
    this.timeSpeed = speed;
  }

  pause(): void { this.isPaused = true; }
  resume(): void { this.isPaused = false; }
}
