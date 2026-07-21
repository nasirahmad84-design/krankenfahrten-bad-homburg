import type { LegalSectionContent } from "@/content/legal/types";

export const privacyContent = {
  eyebrow: "Datenschutz",
  title: "Datenschutzerklärung",
  description: "Informationen zur Verarbeitung personenbezogener Daten beim Besuch dieser Website und bei einer Fahrtanfrage.",
  updatedAt: "21. Juli 2026",
  sections: [
    {
      id: "verantwortlicher",
      title: "1. Verantwortlicher",
      definitions: [
        { term: "Verantwortlicher", description: "Mubasher Ahmad, Krankenfahrten Bad Homburg" },
        { term: "Anschrift", description: "Basler Str. 3, 61352 Bad Homburg, Deutschland" },
        { term: "Telefon", description: "0175 4142222" },
        { term: "E-Mail", description: "anfrage@krankenfahrten-bad-homburg.de" },
      ],
    },
    {
      id: "allgemeine-hinweise",
      title: "2. Allgemeine Hinweise zur Datenverarbeitung",
      paragraphs: [
        "Personenbezogene Daten werden nur verarbeitet, soweit dies für die Bereitstellung der Website, die Sicherheit des Betriebs, die Bearbeitung von Kontaktaufnahmen oder einer Fahrtanfrage erforderlich ist.",
        "Die Website verwendet keine eigene Analytics-Lösung, keine Tracking-Pixel und keine Marketingdienste. Im Websystem besteht keine Datenbank für Fahrtanfragen.",
      ],
    },
    {
      id: "hosting",
      title: "3. Hosting und Server-Logfiles",
      paragraphs: [
        "Die Website wird bei ALL-INKL bereitgestellt. Beim Abruf können durch die Hostinginfrastruktur insbesondere IP-Adresse, Zeitpunkt, angeforderte Datei, Referrer sowie Browser- und Systeminformationen verarbeitet werden, soweit diese Angaben technisch übermittelt und in Server-Logfiles erfasst werden.",
        "Diese Verarbeitung dient der Auslieferung, Stabilität und Sicherheit der Website. Umfang und Speicherdauer der Logfiles richten sich nach der tatsächlich eingesetzten Hostingkonfiguration.",
      ],
    },
    {
      id: "websiteaufruf",
      title: "4. Aufruf der Website",
      paragraphs: [
        "Der Webserver liefert statisch erzeugte HTML-, CSS-, JavaScript-, Schrift- und Bilddateien über eine verschlüsselte HTTPS-Verbindung aus. Die eingebundene Schrift Inter und alle grafischen Ressourcen werden lokal von dieser Website geladen.",
      ],
    },
    {
      id: "kontaktaufnahme",
      title: "5. Kontaktaufnahme per Telefon und E-Mail",
      paragraphs: [
        "Wenn Sie telefonisch oder per E-Mail Kontakt aufnehmen, werden Ihre Angaben zur Bearbeitung Ihres Anliegens und für mögliche Rückfragen verarbeitet. Welche Daten anfallen, richtet sich nach den Informationen, die Sie mitteilen.",
        "Bitte übermitteln Sie keine Diagnosen oder medizinischen Notfalldaten. In akuten Notfällen wählen Sie 112.",
      ],
    },
    {
      id: "anfrageformular",
      title: "6. Anfrageformular",
      paragraphs: [
        "Das Formular dient der Bearbeitung einer unverbindlichen Fahrtanfrage und der anschließenden Kontaktaufnahme. Verarbeitet werden Vorname und Nachname, Telefonnummer, optional E-Mail-Adresse, Fahrtdatum, Uhrzeit, Abhol- und Zieladresse, Fahrtart beziehungsweise Anlass, die optionale Angabe zu Hin- und Rückfahrt, optionale zusätzliche Hinweise und die Zustimmung zur Kontaktaufnahme.",
        "Zusätzlich wird eine technische Formularzeit verarbeitet. Die Anfrage wird an eine fest konfigurierte E-Mail-Adresse des Betreibers übermittelt. Es erfolgt keine Speicherung in einer Datenbank und keine automatische Buchungs- oder Eingangsbestätigung. Eine Fahrt ist erst nach ausdrücklicher Bestätigung vereinbart.",
      ],
    },
    {
      id: "validierung-missbrauchsschutz",
      title: "7. Formularvalidierung und Missbrauchsschutz",
      paragraphs: [
        "Eingaben werden zunächst im Browser und verbindlich erneut im PHP-Endpunkt geprüft. Maximallängen, erlaubte Auswahlwerte, ein verborgenes Leerfeld und eine Plausibilitätsprüfung der technischen Formularzeit begrenzen fehlerhafte oder automatisierte Übermittlungen.",
        "Die Formularzeit stammt aus dem Browser und ist ohne Server-Session nicht kryptografisch abgesichert. Sie ist daher nur ein zusätzliches Missbrauchssignal.",
      ],
    },
    {
      id: "rate-limiting",
      title: "8. Rate Limiting",
      paragraphs: [
        "Zum Schutz vor übermäßig vielen automatisierten Anfragen bildet der PHP-Endpunkt serverseitig aus der IP-Adresse und einem geheimen Schlüssel eine HMAC-gehashte Kennung. Die vollständige IP-Adresse wird nicht in der Rate-Limit-Datei gespeichert.",
        "Für jede Kennung werden Zeitstempel vorübergehend in einer Datei außerhalb des öffentlichen Webroots geführt. Die Beispielkonfiguration berücksichtigt höchstens zehn Anfragen innerhalb von zehn Minuten. Abgelaufene Zeitstempel werden beim nächsten Zugriff auf dieselbe Kennung entfernt; die konkrete Aufbewahrung hängt von der Serverkonfiguration und deren Bereinigung ab.",
      ],
    },
    {
      id: "email-versand",
      title: "9. E-Mail-Versand",
      paragraphs: [
        "Der PHP-Endpunkt versendet die Anfrage über die Mailfunktion der Hostinginfrastruktur an den Betreiber. Als Absender dient eine serverseitig konfigurierte technische Adresse derselben Domain. Eine optionale, gültige Nutzeradresse wird ausschließlich als Reply-To verwendet.",
        "Es wird keine automatische Bestätigungs-E-Mail an die anfragende Person gesendet und kein externer Newsletter- oder Marketingdienst eingesetzt.",
      ],
    },
    {
      id: "empfaenger",
      title: "10. Empfänger und Kategorien von Empfängern",
      paragraphs: [
        "Empfänger einer Formularanfrage ist der Betreiber von Krankenfahrten Bad Homburg. Technisch können der Hostinganbieter und die von ihm bereitgestellte Mailinfrastruktur mit der Verarbeitung befasst sein. Eine Weitergabe zu Werbezwecken erfolgt nicht.",
      ],
    },
    {
      id: "speicherdauer",
      title: "11. Speicherdauer",
      paragraphs: [
        "Formularanfragen werden im Websystem nicht in einer Datenbank gespeichert. Die per E-Mail eingegangenen Angaben werden gelöscht, wenn sie für die Bearbeitung und weitere Kommunikation nicht mehr benötigt werden und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
        "Für Server-Logfiles und technische E-Mail-Daten gelten die Speichereinstellungen der eingesetzten Hosting- und Mailinfrastruktur. Rate-Limit-Daten sind auf ein kurzes konfiguriertes Zeitfenster ausgelegt; ihre technische Dateiaufbewahrung hängt zusätzlich von der serverseitigen Bereinigung ab.",
      ],
    },
    {
      id: "rechtsgrundlagen",
      title: "12. Rechtsgrundlagen",
      paragraphs: [
        "Die Bereitstellung und Absicherung der Website sowie der Schutz vor Missbrauch erfolgen auf Grundlage des berechtigten Interesses an einem sicheren und funktionsfähigen Internetangebot. Kontakt- und Fahrtanfragen werden verarbeitet, soweit dies zur Bearbeitung Ihrer Anfrage und zur Durchführung vorvertraglicher Maßnahmen erforderlich ist.",
        "Soweit eine Verarbeitung auf Ihrer Einwilligung beruht, können Sie diese mit Wirkung für die Zukunft widerrufen. Die Rechtmäßigkeit der Verarbeitung bis zum Widerruf bleibt unberührt. Gesetzliche Aufbewahrungspflichten können eine weitere Verarbeitung erfordern.",
      ],
    },
    {
      id: "betroffenenrechte",
      title: "13. Betroffenenrechte",
      paragraphs: ["Im Rahmen der gesetzlichen Voraussetzungen können Ihnen folgende Rechte zustehen:"],
      items: [
        "Auskunft über die verarbeiteten personenbezogenen Daten",
        "Berichtigung unrichtiger oder Vervollständigung unvollständiger Daten",
        "Löschung oder Einschränkung der Verarbeitung",
        "Datenübertragbarkeit, soweit anwendbar",
        "Widerspruch gegen eine Verarbeitung, soweit die gesetzlichen Voraussetzungen vorliegen",
        "Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft",
      ],
    },
    {
      id: "beschwerderecht",
      title: "14. Beschwerderecht bei einer Aufsichtsbehörde",
      paragraphs: [
        "Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen Datenschutzrecht verstößt. Dieses Recht besteht unbeschadet anderer verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.",
      ],
    },
    {
      id: "bereitstellungspflicht",
      title: "15. Pflicht zur Bereitstellung von Daten",
      paragraphs: [
        "Für den bloßen Websitebesuch müssen Sie keine Daten aktiv angeben. Für die Bearbeitung einer Fahrtanfrage sind die im Formular als Pflichtfelder gekennzeichneten Angaben erforderlich. Ohne diese Angaben kann die Anfrage nicht über das Formular bearbeitet werden. Optionale Felder können leer bleiben.",
      ],
    },
    {
      id: "automatisierte-entscheidungen",
      title: "16. Automatisierte Entscheidungen und Profiling",
      paragraphs: [
        "Es findet keine ausschließlich automatisierte Entscheidung mit rechtlicher oder vergleichbar erheblicher Wirkung und kein Profiling statt. Eine Formularübermittlung führt nicht automatisch zu einer Buchung.",
      ],
    },
    {
      id: "cookies",
      title: "17. Cookies und ähnliche Technologien",
      paragraphs: [
        "Die Website setzt derzeit keine Cookies und verwendet weder Local Storage noch Session Storage. Es gibt keine Analyse-, Marketing- oder Tracking-Cookies und keine gespeicherte Consent-Entscheidung. Das PHP-Formular verwendet keine Session.",
        "Weitere Einzelheiten stehen auf der Seite Cookie-Einstellungen.",
      ],
    },
    {
      id: "externe-dienste",
      title: "18. Externe Inhalte und Dienste",
      paragraphs: [
        "Es sind derzeit keine Karten, Videos, Social-Media-Widgets, externen Schrift-CDNs, Trackingdienste oder sonstigen extern geladenen Medien eingebunden. Die Website lädt ihre Laufzeitressourcen ausschließlich von der eigenen Domain.",
      ],
    },
    {
      id: "datensicherheit",
      title: "19. Datensicherheit",
      paragraphs: [
        "Die Website ist für die verschlüsselte Übertragung per HTTPS vorgesehen. Eingaben werden serverseitig validiert, Zieladresse und Absender der E-Mail sind nicht durch den Browser steuerbar, und Konfigurationsdateien werden gegen öffentlichen Abruf geschützt. Kein technisches Verfahren kann einen absoluten Schutz gewährleisten.",
      ],
    },
    {
      id: "stand",
      title: "20. Stand der Datenschutzerklärung",
      paragraphs: ["Stand: 21. Juli 2026"],
    },
  ] satisfies readonly LegalSectionContent[],
} as const;
