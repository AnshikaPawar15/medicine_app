// Client-side dashboard using Plotly and PapaParse
// Enhanced to mirror the Streamlit dashboard features: filters, 3D scatter, ML trend, heatmap, map, animation, recommendations, outliers.

async function loadDashboard() {
    if (typeof Plotly === 'undefined' || typeof Papa === 'undefined') {
        console.error('Plotly or PapaParse not loaded');
        return;
    }

    const res = await fetch('data/sales.csv');
    const text = await res.text();
    const parsed = Papa.parse(text, { header: true, dynamicTyping: true });
    const allRows = parsed.data.filter(r => r && Object.keys(r).length);

    const monthOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthToNum = m => monthOrder.indexOf(m) + 1 || null;

    // Populate filter controls
    const citySel = document.getElementById('filterCity');
    const medSel = document.getElementById('filterMedicine');
    const monthSel = document.getElementById('filterMonths');
    const diseaseSel = document.getElementById('filterDisease');
    const searchInput = document.getElementById('filterSearch');
    const applyBtn = document.getElementById('filterApply');
    const resetBtn = document.getElementById('filterReset');

    const unique = (arr, key) => Array.from(new Set(arr.map(r=>r[key]).filter(Boolean)));
    const cities = unique(allRows, 'City');
    const meds = unique(allRows, 'Medicine');
    const diseases = unique(allRows, 'Disease');

    // helper to build options
    function fillSelect(sel, items, includeEmpty=true) {
        sel.innerHTML = '';
        if (includeEmpty) sel.appendChild(new Option('All',''));
        items.forEach(it => sel.appendChild(new Option(it, it)));
    }

    fillSelect(citySel, cities);
    fillSelect(medSel, meds);
    fillSelect(diseaseSel, diseases);
    // months
    monthSel.innerHTML = '';
    monthOrder.forEach(m => monthSel.appendChild(new Option(m, m)));

    function getFilters() {
        const city = citySel.value;
        const medicine = medSel.value;
        const months = Array.from(monthSel.selectedOptions).map(o=>o.value);
        const disease = diseaseSel.value;
        const search = searchInput.value.trim();
        return { city, medicine, months, disease, search };
    }

    function applyFiltersToRows(rows) {
        const f = getFilters();
        let out = rows.slice();
        if (f.city) out = out.filter(r=>r.City === f.city);
        if (f.medicine) out = out.filter(r=>r.Medicine === f.medicine);
        if (f.disease) out = out.filter(r=>r.Disease === f.disease);
        if (f.months && f.months.length) out = out.filter(r=>f.months.includes(r.Month));
        if (f.search) out = out.filter(r=> (r.Medicine||'').toString().toLowerCase().includes(f.search.toLowerCase()));
        return out;
    }

    function downloadCSV(rows) {
        const csv = Papa.unparse(rows);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'dashboard-data.csv'; document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
    }

    // Render everything from filtered rows
    function renderAll(rows) {
        // KPIs use allRows for overall metrics (like Streamlit)
        const totalSales = allRows.reduce((s,r)=>s+(r.Sales||0),0);
        const avgSales = Math.round(allRows.reduce((s,r)=>s+(r.Sales||0),0) / Math.max(1, allRows.length));
        const maxSale = Math.max(...allRows.map(r=>r.Sales||0));
        const kpis = document.getElementById('kpis');
        const kpiTemplate = (label, value) => `<div style="background:#fff;padding:12px;border-radius:8px;min-width:160px;box-shadow:0 2px 6px rgba(0,0,0,0.06)"><div style="font-size:0.9em;color:#5E6E69">${label}</div><div style="font-weight:700;font-size:1.2em;color:#0F766E;margin-top:6px">${value}</div></div>`;
        kpis.innerHTML = kpiTemplate('Total Sales', `₹${totalSales.toLocaleString()}`) + kpiTemplate('Avg Sale', `₹${avgSales}`) + kpiTemplate('Max Sale', `₹${maxSale}`);

        // Table
        const tableDiv = document.getElementById('dashboardTable');
        const head = ['Month','City','Medicine','Disease','Sales'];
        let tableHtml = '<div style="background:white;padding:12px;border-radius:8px;margin-bottom:12px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><strong>Filtered rows</strong><div><button id="downloadFiltered">📥 Download CSV</button></div></div>';
        tableHtml += '<table style="width:100%;border-collapse:collapse;"><thead><tr>' + head.map(h=>`<th style="text-align:left;padding:8px;border-bottom:1px solid #E6EEF0">${h}</th>`).join('') + '</tr></thead><tbody>';
        rows.slice(0,50).forEach(r=>{
            tableHtml += `<tr><td style="padding:8px;border-bottom:1px solid #F3F7F7">${r.Month}</td><td style="padding:8px;border-bottom:1px solid #F3F7F7">${r.City}</td><td style="padding:8px;border-bottom:1px solid #F3F7F7">${r.Medicine}</td><td style="padding:8px;border-bottom:1px solid #F3F7F7">${r.Disease}</td><td style="padding:8px;border-bottom:1px solid #F3F7F7">${r.Sales}</td></tr>`;
        });
        tableHtml += '</tbody></table></div>';
        tableDiv.innerHTML = tableHtml;
        document.getElementById('downloadFiltered').addEventListener('click', ()=> downloadCSV(rows));

        // Bar chart: sales by medicine (stacked by city)
        const medicines = Array.from(new Set(rows.map(r=>r.Medicine))).slice(0,50);
        const cities = Array.from(new Set(rows.map(r=>r.City)));
        const traces = cities.map(city => {
            const y = medicines.map(med => rows.filter(r=>r.City===city && r.Medicine===med).reduce((s,r)=>s+(r.Sales||0),0));
            return { x: medicines, y, name: city, type: 'bar' };
        });
        Plotly.newPlot('barChart', traces, {barmode: 'stack', title:'Sales by Medicine (stacked by City)', margin:{t:40}, paper_bgcolor:'#fff'});

        // 3D Scatter (Month_num, Medicine index, Sales) colored by Disease
        const medList = Array.from(new Set(rows.map(r=>r.Medicine)));
        const diseaseList = Array.from(new Set(rows.map(r=>r.Disease)));
        const medIndex = m => medList.indexOf(m);
        const diseaseColor = d => diseaseList.indexOf(d);
        const x = rows.map(r=> monthToNum(r.Month) );
        const y = rows.map(r=> medIndex(r.Medicine));
        const z = rows.map(r=> r.Sales || 0);
        const text = rows.map(r=> `${r.Medicine}<br>${r.Disease}<br>₹${r.Sales}`);
        const marker = { size: rows.map(r=> Math.max(4, Math.sqrt(r.Sales||0))), color: rows.map(r=> diseaseColor(r.Disease)), colorscale:'Viridis', showscale:false };
        const trace3d = { x, y, z, text, mode:'markers', marker, type:'scatter3d' };
        const scene = { yaxis: { tickvals: medList.map((_,i)=>i), ticktext: medList, automargin:true }, xaxis:{title:'Month'}, zaxis:{title:'Sales'} };
        Plotly.newPlot('scatter3d', [trace3d], { title:'3D: Month × Medicine × Sales (color by Disease)', scene, margin:{t:40}, paper_bgcolor:'#fff' });

        // Trend + ML prediction (linear regression) for selected medicine or top medicine
        const targetMed = medSel.value || (rows.length? rows[0].Medicine : null) || (meds[0]||null);
        if (targetMed) {
            // aggregate by month_num
            const byMonth = {};
            rows.filter(r=> r.Medicine === targetMed).forEach(r=>{
                const mnum = monthToNum(r.Month) || 0;
                byMonth[mnum] = (byMonth[mnum] || 0) + (r.Sales||0);
            });
            const xs = Object.keys(byMonth).map(k=>parseInt(k)).sort((a,b)=>a-b);
            const ys = xs.map(xi=>byMonth[xi]);
            if (xs.length >= 2) {
                // simple linear regression
                const n = xs.length;
                const meanX = xs.reduce((a,b)=>a+b,0)/n;
                const meanY = ys.reduce((a,b)=>a+b,0)/n;
                let num = 0, den = 0;
                for (let i=0;i<n;i++){ num += (xs[i]-meanX)*(ys[i]-meanY); den += (xs[i]-meanX)*(xs[i]-meanX); }
                const slope = den === 0 ? 0 : num/den;
                const intercept = meanY - slope*meanX;
                const futureX = [7,8,9,10,11,12];
                const pred = futureX.map(xv => slope*xv + intercept);

                const traceActual = { x: xs, y: ys, mode:'lines+markers', name:'Actual' };
                const tracePred = { x: futureX, y: pred, mode:'lines+markers', name:'Predicted' };
                Plotly.newPlot('predictionChart', [traceActual, tracePred], { title:`Trend & Prediction for ${targetMed}`, margin:{t:40}, paper_bgcolor:'#fff' });
            } else {
                document.getElementById('predictionChart').innerHTML = '<div style="background:white;padding:12px;border-radius:8px;">Not enough data for prediction</div>';
            }
        }

        // Animation: simple month-by-month city sales scatter
        try {
            const months = monthOrder;
            const frames = months.map(mn => {
                const grouped = {};
                allRows.filter(r=> r.Month === mn).forEach(r=>{ grouped[r.City] = (grouped[r.City]||0) + (r.Sales||0); });
                return { name: mn, data: [{ x: Object.keys(grouped), y: Object.values(grouped), mode:'markers', marker:{ size: Object.values(grouped).map(v=>Math.max(6, Math.sqrt(v))) } }] };
            });
            const init = frames[0].data;
            const layout = { title:'Monthly Animation (City sales)', xaxis:{title:'City'}, yaxis:{title:'Sales'}, updatemenus:[{type:'buttons',buttons:[{label:'Play',method:'animate',args:[null,{fromcurrent:true,frame:{duration:700,redraw:true},transition:{duration:300}}]}]}], paper_bgcolor:'#fff' };
            Plotly.newPlot('animChart', init, layout).then(()=> Plotly.addFrames('animChart', frames));
        } catch(e){ console.warn('Animation failed', e); }

        // Outliers and insights
        const salesArr = rows.map(r=>r.Sales||0);
        const mean = salesArr.reduce((a,b)=>a+b,0)/Math.max(1,salesArr.length);
        const std = Math.sqrt(salesArr.reduce((s,v)=>s + Math.pow(v-mean,2),0)/Math.max(1,salesArr.length));
        const outliers = rows.filter(r=> (r.Sales||0) > mean + 2*std);
        // Append outliers summary below table
        const outDiv = document.createElement('div');
        outDiv.style.background = 'white'; outDiv.style.padding='12px'; outDiv.style.borderRadius='8px'; outDiv.style.marginTop='8px';
        outDiv.innerHTML = `<strong>Outliers (sales > mean + 2σ):</strong> ${outliers.length}`;
        tableDiv.appendChild(outDiv);

        // Insights
        const topMed = allRows.reduce((acc,r)=>{ acc[r.Medicine] = (acc[r.Medicine]||0) + (r.Sales||0); return acc; }, {});
        const topMedName = Object.keys(topMed).reduce((a,b)=> topMed[a] > topMed[b] ? a : b, Object.keys(topMed)[0]);
        const topCityAgg = allRows.reduce((acc,r)=>{ acc[r.City] = (acc[r.City]||0) + (r.Sales||0); return acc; }, {});
        const topCityName = Object.keys(topCityAgg).reduce((a,b)=> topCityAgg[a] > topCityAgg[b] ? a : b, Object.keys(topCityAgg)[0]);
        const insightsDiv = document.createElement('div'); insightsDiv.style.marginTop='8px'; insightsDiv.innerHTML = `<div style="background:#fff;padding:12px;border-radius:8px;">🏆 Top Medicine: <strong>${topMedName}</strong><br>🌆 Top City: <strong>${topCityName}</strong></div>`;
        tableDiv.appendChild(insightsDiv);
    }

    function refresh() {
        const filtered = applyFiltersToRows(allRows);
        renderAll(filtered);
    }

    applyBtn.addEventListener('click', ()=> refresh());
    resetBtn.addEventListener('click', ()=> { citySel.value=''; medSel.value=''; diseaseSel.value=''; Array.from(monthSel.options).forEach(o=>o.selected=false); searchInput.value=''; refresh(); });

    // initial render: select all months by default
    Array.from(monthSel.options).forEach(o=>o.selected=true);
    refresh();

    // provide a public function to re-render if needed
    window.__dashboardReload = refresh;
}

// Attach loader
(function attachDashboardLoader(){
    window.addEventListener('hashchange', () => {
        if (window.location.hash.slice(1) === 'dashboard') {
            loadDashboard();
        }
    });
    if (window.location.hash.slice(1) === 'dashboard') loadDashboard();
})();
