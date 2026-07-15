'use strict';

/* Shared Tracker templates: one for every challenge and one for every sim-funded account. */
function renderAccountPanel(acct) {
  var id = acct.id, r = acct.rules || {};
  var isChallenge = acct.status === 'challenge';
  var started = acct.started.split('-').reverse().join('/').replace(/^0/,'').replace(/\/0/g,'/');
  var ddLabel = (r.ddType || 'EOD').toUpperCase() + ' Drawdown';
  var badges = '<div class="fr-badge bad">' + ddLabel + ' $' + Number(r.dd || 0).toLocaleString() + '</div>';
  if (isChallenge && r.target) badges += '<div class="fr-badge ok">Profit Target $' + Number(r.target).toLocaleString() + '</div>';
  if (r.minDays) badges += '<div class="fr-badge warn">Min ' + r.minDays + ' Trading Days</div>';
  if (r.consistencyCapDay) badges += '<div class="fr-badge bad">Best Day &lt; $' + Number(r.consistencyCapDay).toLocaleString() + '</div>';
  else if (r.consistencyPct) badges += '<div class="fr-badge bad">' + (r.consistencyPct * 100) + '% Consistency Cap</div>';
  else if (r.consistencyCapPct) badges += '<div class="fr-badge bad">' + (r.consistencyCapPct * 100) + '% Consistency Cap</div>';
  else badges += '<div class="fr-badge ok">No Consistency Rule</div>';
  if (!isChallenge) {
    if (r.payoutDays) badges += '<div class="fr-badge warn">Payout after ' + r.payoutDays + ' Day' + (r.payoutDays === 1 ? '' : 's') + '</div>';
    if (r.minPayout) badges += '<div class="fr-badge ok">Min Payout $' + Number(r.minPayout).toLocaleString() + '</div>';
    if (r.profitSplit) badges += '<div class="fr-badge ok">' + (r.profitSplit * 100) + '% Profit Split</div>';
    if (r.buffer) badges += '<div class="fr-badge warn">Payout Buffer $' + Number(r.buffer).toLocaleString() + '</div>';
  }
  if (r.renewalDate) badges += '<div class="fr-badge warn">Renews ' + r.renewalDate + '</div>';

  var consistency = '<div id="' + id + '-cons-empty" style="background:rgba(51,224,138,0.1); border:1px solid rgba(51,224,138,0.3); border-radius:8px; padding:14px; font-size:12px; color:#33e08a;">No Consistency Rule</div>'
    + '<div id="' + id + '-cons-wrap" style="display:none;">' + progressBar('Consistency Check', id+'-cons-lbl', id+'-cons-bar', id+'-cons-note', '#33e08a') + '</div>';
  var renewalProgress = r.renewalDate ? '<div>' + progressBar('Renewal Countdown', id+'-renewal-lbl', id+'-renewal-bar', id+'-renewal-note', '#f5b13d') + '</div>' : '';
  var challengeProgress = isChallenge
    ? '<div style="background:#0a0e14; border:1px solid rgba(255,255,255,0.09); border-radius:12px; padding:20px; margin-bottom:16px;"><div style="font-size:10px; font-weight:700; color:#59626f; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:14px; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.07);">' + (r.renewalDate ? 'Profit Target and Renewal Countdown' : 'Profit Progress') + '</div><div style="display:grid; grid-template-columns:' + (r.renewalDate ? '1fr 1fr' : '1fr') + '; gap:24px;"><div>' + progressBar('Profit Target', id+'-profit-lbl', id+'-profit-bar', id+'-profit-note', '#33e08a') + '</div>' + renewalProgress + '</div></div>'
    : '';

  return '<div style="margin-bottom:28px;">'
    + '<div style="font-size:14px; font-weight:600; color:#8a94a3; text-transform:uppercase; letter-spacing:0.6px; margin-bottom:16px; padding-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.09);"><span class="fr-dot ' + (isChallenge ? 'warn' : 'ok live') + '" style="margin-right:9px;"></span>' + (isChallenge ? 'CHALLENGE ACCOUNT' : 'SIM FUNDED ACCOUNT') + ' &mdash; ' + acct.name + '</div>'
    + '<div style="font-size:11px; color:#59626f; margin-bottom:8px; padding-left:2px;">Account: <span style="color:#8a94a3; font-weight:600; font-family:var(--mono);">' + acct.accountNumber + '</span> &nbsp;&middot;&nbsp; Started: <span style="color:#8a94a3; font-weight:600;">' + started + '</span> &nbsp;&middot;&nbsp; <button data-acct-id="' + id + '" onclick="showRecordsModal(this.dataset.acctId)" class="fr-btn-ghost fr-btn-xs">Records</button></div>'
    + '<div style="background:#0e131b; border:1px solid rgba(255,255,255,0.09); border-radius:10px; padding:14px 20px; margin-bottom:16px; display:flex; flex-wrap:wrap; gap:10px; align-items:center;"><div style="font-size:11px; color:#59626f; text-transform:uppercase; letter-spacing:0.6px; margin-right:4px;">Rules:</div>' + badges + '</div>'
    + '<div style="background:#0a0e14; border:1px solid rgba(255,255,255,0.09); border-radius:12px; padding:20px; margin-bottom:16px;"><div style="font-size:10px; font-weight:700; color:#59626f; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:14px; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.07);">Balance</div><div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px;">' + statBox('Current Balance', id+'-stat-bal', '--', '#33e08a') + statBox('Highest Trailing', id+'-stat-peak', '--') + statBox('Best Single Day', id+'-stat-bday', '--') + '</div></div>'
    + '<div style="background:#0a0e14; border:1px solid rgba(255,255,255,0.09); border-radius:12px; padding:20px; margin-bottom:16px;"><div style="font-size:10px; font-weight:700; color:#59626f; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:14px; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.07);">Trading Days</div><div style="display:grid; grid-template-columns:repeat(2,1fr); gap:12px;">' + statBox('Total Trading Days', id+'-stat-days', '0') + statBox('Minimum Days', '', r.minDays || 'None', '#f5b13d') + '</div></div>'
    + '<div style="background:#0a0e14; border:1px solid rgba(255,255,255,0.09); border-radius:12px; padding:20px; margin-bottom:16px;"><div style="font-size:10px; font-weight:700; color:#59626f; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:14px; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.07);">Drawdown &amp; Consistency</div><div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;"><div><div style="background:#0e131b; border-radius:8px; padding:12px 14px; margin-bottom:12px;"><div style="font-size:10px; color:#59626f; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Drawdown Floor</div><div id="' + id + '-dd-floor" style="font-size:16px; font-weight:700; color:#f5b13d;">--</div></div>' + progressBar('Drawdown Used', id+'-dd-lbl', id+'-dd-bar', id+'-dd-note', '#ff5e57') + '</div><div>' + consistency + '</div></div></div>'
    + challengeProgress + '</div>';
}

function calcAccountPanel(acct) {
  var id = acct.id, r = acct.rules || {};
  var bal = Number(acct.balance || 0), peak = Math.max(Number(acct.peak || bal), bal), bestDay = Number(acct.bestDay || 0), dd = Number(r.dd || 0);
  var staticFloor = String(r.ddType || '').toLowerCase() === 'static';
  var floor = Number(r.drawdownFloor || (staticFloor ? Number(r.start || 0) - dd : peak - dd));
  var ddUsed = Math.max(0, peak - bal), ddPct = dd ? Math.min(100, ddUsed / dd * 100) : 0;
  el(id+'-stat-bal').textContent = '$'+bal.toLocaleString('en-US',{minimumFractionDigits:2});
  el(id+'-stat-bal').style.color = bal >= Number(r.start || 0) ? '#33e08a' : '#ff5e57';
  el(id+'-stat-peak').textContent = '$'+peak.toLocaleString('en-US',{minimumFractionDigits:2});
  el(id+'-stat-bday').textContent = fmt(bestDay);
  el(id+'-stat-days').textContent = (acct.records || []).length;
  el(id+'-dd-floor').textContent = '$'+floor.toLocaleString('en-US',{minimumFractionDigits:2});
  el(id+'-dd-floor').style.color = bal <= floor ? '#ff5e57' : '#f5b13d';
  bar(id+'-dd-bar', ddPct, barColor(ddPct));
  el(id+'-dd-lbl').textContent = '$'+ddUsed.toFixed(2)+' / $'+dd.toLocaleString();
  el(id+'-dd-note').textContent = bal <= floor ? 'Breached' : 'Floor $'+floor.toFixed(2)+'  $'+(bal-floor).toFixed(2)+' buffer';
  var cap = r.consistencyCapDay ? Number(r.consistencyCapDay) : (r.consistencyPct && r.target ? Number(r.target) * Number(r.consistencyPct) : 0);
  if (cap > 0) {
    el(id+'-cons-empty').style.display = 'none'; el(id+'-cons-wrap').style.display = '';
    var pct = Math.min(100, bestDay / cap * 100), breached = bestDay > cap;
    bar(id+'-cons-bar', pct, breached ? '#ff5e57' : barColor(pct));
    el(id+'-cons-lbl').textContent = bestDay > 0 ? '$'+bestDay.toFixed(2)+' / $'+cap.toFixed(2)+' cap' : 'No trades yet';
    el(id+'-cons-note').textContent = breached ? 'Consistency violated' : 'Best day must stay below $'+cap.toFixed(2);
  }
  if (acct.status === 'challenge' && r.target) {
    var profit = bal - Number(r.start || 0), targetPct = Math.min(100, Math.max(0, profit / Number(r.target) * 100));
    bar(id+'-profit-bar', targetPct, '#33e08a');
    el(id+'-profit-lbl').textContent = '$'+Math.max(0, profit).toFixed(2)+' / $'+Number(r.target).toLocaleString();
    el(id+'-profit-note').textContent = profit >= r.target ? 'Target met' : '$'+Math.max(0, r.target-profit).toFixed(2)+' still needed';
  }
  if (acct.status === 'challenge' && r.renewalDate && el(id+'-renewal-lbl')) {
    var renewalDate = parseYmdLocal(r.renewalDate);
    var daysLeft = Math.ceil((renewalDate - new Date()) / 86400000);
    var renewalPct = Math.max(0, Math.min(100, (30 - daysLeft) / 30 * 100));
    var renewalColor = daysLeft <= 5 ? '#ff5e57' : '#f5b13d';
    bar(id+'-renewal-bar', renewalPct, renewalColor);
    el(id+'-renewal-lbl').textContent = daysLeft > 0 ? daysLeft + ' days left' : 'Expired';
    el(id+'-renewal-lbl').style.color = renewalColor;
    el(id+'-renewal-note').textContent = 'Renews ' + r.renewalDate;
  }
}
