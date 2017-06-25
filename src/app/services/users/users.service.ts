import { Injectable } from '@angular/core';
import { ApiService } from '../index';
import { Observable } from 'rxjs/Observable';
//noinspection TypeScriptCheckImport
import * as _ from 'lodash';

@Injectable()
export class UserService {
  // Request path for user
  public path: string = '/user';
  // Describe params allowed for user create/update
  public userPropsAllowed: [string] = [
    'firstName',
    'lastName',
    'username',
    'email',
    'gender',
    'dob',
    'role',
    'status',
    'password'
  ];

  constructor(
    private api: ApiService
  ) {}

  /**
   * Request list of users with pagination params
   * @param paginationSettings
   * @returns {Observable<any>}
   */
  public getUsers(paginationSettings: string): Observable<any> {
    return this.api.get(`${this.path}${paginationSettings}`);
  }

  /**
   * Request one user by userId
   * @param userId
   * @returns {Observable<any>}
   */
  public getOneUser(userId: any): Observable<any> {
    return this.api.get(`${this.path}/${userId}`);
  }

  /**
   * Create new user
   * @param newUser
   * @returns {Observable<any>}
   */
  public createUser(newUser: any): Observable<any> {
    // Take only allowed fields and omit forbidden, like "id" or "createdAt"
    const user = _.pick(newUser, this.userPropsAllowed);
    return this.api.post(this.path, user);
  }

  /**
   * Update existing user
   * @param user
   * @returns {Observable<any>}
   */
  public updateUser(user: any): Observable<any> {
    // Take only allowed fields and omit forbidden, like "id" or "createdAt"
    const userData = _.pick(user, this.userPropsAllowed);
    return this.api.put(`${this.path}/${user.id}`, userData);
  }

  /**
   * Remove user by id
   * @param id
   * @returns {Observable<any>}
   */
  public removeUser(id: any): Observable<any> {
    return this.api.delete(`${this.path}/${id}`);
  }
}
