import { Component, OnInit } from '@angular/core';
import { Hello } from './types';
import { QueryRef, Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  helloRef: QueryRef<Hello>;
  hello$: Observable<Hello>;

  constructor(private readonly apollo: Apollo) { }

  ngOnInit() {
    this.helloRef = this.apollo.watchQuery<Hello>({
      query: gql`
        query Query {
          hello
        }
      `,
    });

    this.hello$ = this.helloRef.valueChanges.pipe(
      tap(console.log),
      map(result => result.data),
    );
  }
}
