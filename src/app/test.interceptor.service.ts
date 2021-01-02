import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { tap } from "rxjs/operators";

export class TestInterceptorService implements HttpInterceptor {
	intercept(req: HttpRequest<any>, next: HttpHandler) {
		console.log("intercept request", req.url);

		let modReq = req.clone({ headers: req.headers.append("AddByMe", "value") });
		return next.handle(modReq).pipe(
			tap(event => console.log("interceptor handle event:", event.type))
		);
	}
}