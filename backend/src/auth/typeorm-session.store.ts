import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';
import * as session from 'express-session';

@Injectable()
export class TypeOrmSessionStore extends session.Store {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {
    super();
  }

  get(
    sid: string,
    callback: (err: any, session?: session.SessionData | null) => void,
  ): void {
    this.sessionRepository
      .findOne({ where: { sid } })
      .then((session) => {
        if (!session) {
          return callback(null, null);
        }
        if (session.expiresAt.valueOf() < Date.now()) {
          this.destroy(sid, (err) => callback(err));
        } else {
          const sessionData = JSON.parse(session.sess);
          callback(null, sessionData);
        }
      })
      .catch((err) => callback(err));
  }

  set(
    sid: string,
    session: session.SessionData,
    callback?: (err?: any) => void,
  ): void {
    const sessionEntity = new Session();
    sessionEntity.sid = sid;
    sessionEntity.sess = JSON.stringify(session);
    sessionEntity.expiresAt = new Date(
      Date.now() + (session.cookie.maxAge || 86400000),
    );

    this.sessionRepository
      .save(sessionEntity)
      .then(() => callback && callback())
      .catch((err) => callback && callback(err));
  }

  destroy(sid: string, callback?: (err?: any) => void): void {
    this.sessionRepository
      .delete({ sid: sid })
      .then(() => callback && callback())
      .catch((err) => callback && callback(err));
  }
}
