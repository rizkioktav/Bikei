<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AuthTypeMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $authType = $request->input('auth_type');
        
        if ($authType === 'jwt' && !$request->header('Authorization')) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        return $next($request);
    }
}
