import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, take } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{

    constructor(private authService : AuthService){}

    intercept(req : HttpRequest<any>, next : HttpHandler ){
        return this.authService.user.pipe(
            take(1),
            exhaustMap(user => {
                if(!user){              //if user is null -> for login and signup requests, we dont add token to url
                    return next.handle(req);
                }
                const modifiedReq = req.clone({
                    params : new HttpParams().set('auth',user.token)
                })
                return next.handle(modifiedReq);
            })
        )
    }
}