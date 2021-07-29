import { Component, OnInit } from '@angular/core';

import { Hero } from './hero';
import { HeroesService } from './heroes.service';

import { HttpClient } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  providers: [HeroesService],
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  private handleError: HandleError;

  private heroesUrl = 'api/heroes';
  heroes: Hero[] = [];

  heroIsValid = false;

  heroForm = new FormGroup({
    heroName: new FormControl('', [Validators.required])
  });

  constructor(
    private heroesService: HeroesService,
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    this.handleError = httpErrorHandler.createHandleError('HeroesService');
  }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.http
      .get<Hero[]>(this.heroesUrl)
      .pipe(catchError(this.handleError('getHeroes', [])))
      .subscribe(heroes => {
        this.heroes = heroes;
      });
  }

  add(name: string): void {
    name = name.trim();
    if (name.length < 5) {
      this.heroIsValid = false;
      return;
    }

    this.heroIsValid = true;
    const newHero: Hero = { name } as Hero;
    this.heroesService.addHero(newHero).subscribe(hero => {
      this.heroes.push(hero);
      this.heroForm.reset();
    });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroesService.deleteHero(hero.id).subscribe();
  }

  onSubmit(): void {
    this.add(this.heroForm.value.heroName);
  }

  formatHeroName(hero: Hero): any {
    return hero.name.toUpperCase();
  }
}
