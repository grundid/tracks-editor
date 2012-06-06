package org.osmsurround.selective.spring;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class LocaleInjectInterceptor extends HandlerInterceptorAdapter {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		request.setAttribute("currentLocale", LocaleContextHolder.getLocale().toString());
		request.setAttribute("currentLocaleLanguage", LocaleContextHolder.getLocale().getLanguage());
		return true;
	}
}
