import { JwtService } from '@nestjs/jwt';
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    private readonly logger = new Logger(JwtAuthGuard.name);
    constructor(private jwtService: JwtService) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();

        // Throws unauthorized error if no JWT passed
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader.split(' ')[1];
            const jwtDecoded = this.jwtService.decode(token);
            return true;
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error: `Unauthorized`
            }, HttpStatus.UNAUTHORIZED)
        }
  }
}