package org.osmsurround.selective.spring;

import java.util.Enumeration;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.i18n.SessionLocaleResolver;

public class RequestAndSessionLocaleResolver extends SessionLocaleResolver {

	private Map<String, Locale> supportedLanguages;

	public RequestAndSessionLocaleResolver() {
	}

	/**
	 * Create a FixedLocaleResolver that exposes the given locale.
	 * 
	 * @param locale
	 *            the locale to expose
	 */
	public RequestAndSessionLocaleResolver(Locale locale) {
		setDefaultLocale(locale);
	}

	public RequestAndSessionLocaleResolver(Locale locale, Map<String, Locale> supportedLanguages) {
		setDefaultLocale(locale);
		this.supportedLanguages = supportedLanguages;
	}

	@SuppressWarnings("unchecked")
	@Override
	protected Locale determineDefaultLocale(HttpServletRequest request) {
		Locale defaultLocale = getDefaultLocale();
		if (request.getHeader("accept-language") != null || defaultLocale == null) {
			if (supportedLanguages == null || supportedLanguages.isEmpty())
				defaultLocale = request.getLocale();
			else {
				Enumeration<Locale> userLocales = request.getLocales();
				while (userLocales.hasMoreElements()) {
					Locale locale = userLocales.nextElement();
					if (supportedLanguages.containsKey(locale.getLanguage())) {
						defaultLocale = supportedLanguages.get(locale.getLanguage());
						break;
					}
				}
			}
		}

		return defaultLocale;
	}
}
