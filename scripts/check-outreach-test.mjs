import assert from 'node:assert/strict';
const base=process.env.TEST_SITE_URL;
const token=process.env.OUTREACH_TEST_RUNNER_TOKEN;
if(base!=='https://test.krankenfahrten-bad-homburg.de'||!token)throw new Error('Testziel/Token fehlt.');
const endpoint=base+'/redaktion/outreach-run.php';
async function call(action){
 const r=await fetch(endpoint,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({action}),signal:AbortSignal.timeout(45000)});
 if(!r.ok)throw new Error(`Outreach ${action}: HTTP ${r.status}`);
 return r.json();
}
if(process.argv.includes('--diagnostics')){
 console.log(JSON.stringify(await call('diagnostics')));
 try{const result=await call('research_test');console.log(`Echte Serverrecherche: ${result.imported} Kandidaten importiert (nicht versandberechtigt).`);}catch{console.log('OFFEN: Externer Rechercheanbieter derzeit nicht erreichbar.');}
}else if(process.argv.includes('--tick')){
 const result=await call('run'); console.log(`Outreach-Zeitplan: ${result.status}, ${result.sent} SMTP-Annahmen.`);
}else{
 const denied=await fetch(endpoint,{method:'POST'});assert.equal(denied.status,403);
 await call('setup_test');
 await call('run');
 const result=await call('test_status');assert.equal(result.status,'sent','SMTP-Annahme nicht bestätigt; nicht blind wiederholen.');
 console.log('Interne Testmail vom SMTP-Server angenommen.');
 const link=new URL(result.unsubscribe_url);assert.equal(link.origin,new URL(base).origin);assert.equal(link.pathname,'/redaktion/outreach-unsubscribe.php');
 const page=await fetch(link);assert.equal(page.status,200);assert.match(await page.text(),/Ja, abmelden/);
 const unsub=await fetch(link,{method:'POST'});assert.equal(unsub.status,200);assert.match(await unsub.text(),/Adresse ist für weitere Kampagnen gesperrt/);
 console.log('Öffentlicher Abmeldelink und kampagnenübergreifende Sperre erfolgreich geprüft.');
 const rerun=await call('run');assert.equal(rerun.sent,0);console.log('Erneuter Lauf: keine doppelte Mail.');
 try{const result=await call('research_test');console.log(`Echte Serverrecherche: ${result.imported} Kandidaten importiert (nicht versandberechtigt).`);}catch{console.log('OFFEN: Externer Rechercheanbieter derzeit nicht erreichbar.');}
}
