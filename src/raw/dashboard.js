(function () {
      var root = document.documentElement;
      var titleEl = document.getElementById("view-title");
      var themeBtn = document.getElementById("theme-toggle");
      var openDrawer = document.getElementById("open-drawer");
      var drawer = document.getElementById("drawer");
      var backdrop = document.getElementById("drawer-backdrop");
      var chartsReady = false;
      var charts = {};

      try {
        var stored = localStorage.getItem("solohome-theme");
        if (stored === "light" || stored === "dark") root.setAttribute("data-theme", stored);
      } catch (e) {}

      function cssVar(name) {
        return getComputedStyle(root).getPropertyValue(name).trim();
      }

      themeBtn.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
        root.setAttribute("data-theme", next);
        try { localStorage.setItem("solohome-theme", next); } catch (e) {}
        if (chartsReady) refreshCharts();
      });

      function hours24() {
        var labels = [];
        for (var i = 0; i < 24; i++) labels.push(String(i).padStart(2, "0") + ":00");
        return labels;
      }

      function loadSeries() {
        var out = [];
        for (var i = 0; i < 24; i++) {
          var night = i < 6 || i > 22 ? 0.9 : 0;
          var morning = i >= 6 && i <= 9 ? 1.4 : 0;
          var evening = i >= 17 && i <= 21 ? 2.1 : 0;
          var base = 1.1 + 0.35 * Math.sin((i / 24) * Math.PI * 2);
          out.push(+(base + night * 0.2 + morning + evening * (0.6 + 0.1 * Math.sin(i))).toFixed(2));
        }
        return out;
      }

      function ensureCharts() {
        if (chartsReady || typeof echarts === "undefined") return;
        var elE = document.getElementById("chart-energy");
        var elP = document.getElementById("chart-perms");
        var elD = document.getElementById("chart-domains");
        if (!elE || !elP || !elD) return;
        chartsReady = true;
        charts.energy = echarts.init(elE);
        charts.perms = echarts.init(elP);
        charts.domains = echarts.init(elD);
        refreshCharts();
      }

      function refreshCharts() {
        if (!charts.energy) return;
        var primary = cssVar("--color-primary");
        var accent = cssVar("--color-accent-secondary");
        var success = cssVar("--color-success");
        var warn = cssVar("--color-warning");
        var danger = cssVar("--color-danger");
        var fg = cssVar("--color-fg");
        var muted = cssVar("--color-fg-muted");
        var grid = cssVar("--chart-grid");
        var surface = cssVar("--color-surface");
        var series = loadSeries();
        var textStyle = { color: muted, fontFamily: "Inter, system-ui, sans-serif", fontSize: 11 };

        charts.energy.setOption({
          color: [primary, accent],
          textStyle: textStyle,
          grid: { left: 44, right: 16, top: 28, bottom: 36 },
          tooltip: {
            trigger: "axis",
            backgroundColor: surface,
            borderColor: cssVar("--color-border"),
            textStyle: { color: fg, fontSize: 12 }
          },
          legend: {
            data: ["Load kW", "Setback target"],
            textStyle: { color: muted, fontSize: 11 },
            top: 0
          },
          xAxis: {
            type: "category",
            data: hours24(),
            axisLine: { lineStyle: { color: grid } },
            axisLabel: { color: muted, interval: 3, fontSize: 10 },
            axisTick: { show: false }
          },
          yAxis: {
            type: "value",
            name: "kW",
            nameTextStyle: { color: muted, fontSize: 10 },
            splitLine: { lineStyle: { color: grid, type: "dashed" } },
            axisLabel: { color: muted, fontSize: 10 }
          },
          series: [
            {
              name: "Load kW",
              type: "line",
              smooth: 0.35,
              symbol: "none",
              lineStyle: { width: 2, color: primary },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgba(74,158,154,0.28)" },
                  { offset: 1, color: "rgba(74,158,154,0.02)" }
                ])
              },
              data: series
            },
            {
              name: "Setback target",
              type: "line",
              smooth: false,
              symbol: "none",
              lineStyle: { width: 1.25, type: "dashed", color: accent },
              data: series.map(function (_, i) { return i >= 9 && i <= 16 ? 1.35 : 2.4; })
            }
          ]
        }, true);

        charts.perms.setOption({
          color: [success, warn, muted, danger],
          textStyle: textStyle,
          tooltip: {
            trigger: "item",
            backgroundColor: surface,
            borderColor: cssVar("--color-border"),
            textStyle: { color: fg, fontSize: 12 }
          },
          series: [{
            type: "pie",
            radius: ["42%", "68%"],
            center: ["50%", "52%"],
            avoidLabelOverlap: true,
            itemStyle: { borderRadius: 4, borderColor: surface, borderWidth: 2 },
            label: { color: muted, fontSize: 11 },
            data: [
              { name: "Always", value: 42 },
              { name: "Ask approved", value: 18 },
              { name: "Never", value: 9 },
              { name: "Hard-block", value: 4 }
            ]
          }]
        }, true);

        charts.domains.setOption({
          color: [primary],
          textStyle: textStyle,
          grid: { left: 100, right: 24, top: 12, bottom: 24 },
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            backgroundColor: surface,
            borderColor: cssVar("--color-border"),
            textStyle: { color: fg, fontSize: 12 }
          },
          xAxis: {
            type: "value",
            splitLine: { lineStyle: { color: grid, type: "dashed" } },
            axisLabel: { color: muted, fontSize: 10 }
          },
          yAxis: {
            type: "category",
            data: ["light", "climate", "binary_sensor", "alarm", "sensor*"],
            axisLabel: { color: muted, fontSize: 11, fontFamily: "JetBrains Mono, monospace" },
            axisTick: { show: false },
            axisLine: { show: false }
          },
          series: [{
            type: "bar",
            data: [186, 94, 61, 12, 8],
            barWidth: 14,
            itemStyle: {
              borderRadius: [0, 4, 4, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "rgba(74,158,154,0.35)" },
                { offset: 1, color: primary }
              ])
            },
            label: { show: true, position: "right", color: muted, fontSize: 10 }
          }]
        }, true);
      }

      function resizeCharts() {
        Object.keys(charts).forEach(function (k) {
          if (charts[k]) charts[k].resize();
        });
      }
      window.addEventListener("resize", resizeCharts);

      function setPanel(id) {
        document.querySelectorAll(".panel").forEach(function (p) {
          p.classList.toggle("active", p.id === "panel-" + id);
        });
        document.querySelectorAll(".nav-item").forEach(function (n) {
          n.classList.toggle("active", n.getAttribute("data-panel") === id);
        });
        var panel = document.getElementById("panel-" + id);
        if (panel && titleEl) titleEl.textContent = panel.getAttribute("data-title") || id;
        if (id === "operations") {
          ensureCharts();
          requestAnimationFrame(function () { resizeCharts(); });
        }
        if (history.replaceState) {
          history.replaceState(null, "", id === "operations" ? "#operations" : "#");
        }
        closeMobile();
      }

      document.querySelectorAll(".nav-item[data-panel]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          setPanel(btn.getAttribute("data-panel"));
        });
      });

      document.querySelectorAll(".ops-intro a[data-panel], .product-links a[data-panel]").forEach(function (a) {
        a.addEventListener("click", function (e) {
          e.preventDefault();
          setPanel(a.getAttribute("data-panel"));
        });
      });

      if (location.hash === "#operations") setPanel("operations");

      function openMobile() {
        drawer.hidden = false;
        backdrop.hidden = false;
        requestAnimationFrame(function () {
          drawer.classList.add("open");
          backdrop.classList.add("open");
        });
      }

      function closeMobile() {
        drawer.classList.remove("open");
        backdrop.classList.remove("open");
        setTimeout(function () {
          drawer.hidden = true;
          backdrop.hidden = true;
        }, 220);
      }

      openDrawer.addEventListener("click", openMobile);
      backdrop.addEventListener("click", closeMobile);

      // Permission segment controls
      document.querySelectorAll(".seg").forEach(function (seg) {
        seg.querySelectorAll("button").forEach(function (btn) {
          btn.addEventListener("click", function () {
            seg.querySelectorAll("button").forEach(function (b) {
              b.setAttribute("aria-pressed", "false");
            });
            btn.setAttribute("aria-pressed", "true");
          });
        });
      });

      // Device filters
      var filters = document.getElementById("device-filters");
      var grid = document.getElementById("devices-grid");
      if (filters && grid) {
        filters.addEventListener("click", function (e) {
          var btn = e.target.closest(".filter-chip");
          if (!btn) return;
          var f = btn.getAttribute("data-filter") || "all";
          filters.querySelectorAll(".filter-chip").forEach(function (c) {
            c.setAttribute("aria-pressed", c === btn ? "true" : "false");
          });
          grid.querySelectorAll(".device-card").forEach(function (card) {
            var cat = card.getAttribute("data-cat") || "";
            var show = f === "all" || cat.indexOf(f) !== -1;
            card.hidden = !show;
          });
        });
      }

      // Demo composers with HA-aware replies
      function agentReply(text) {
        var t = text.toLowerCase();
        if (/secure|security|alarm|doors?|locks?/.test(t)) {
          return {
            body: "Security check complete. Perimeter sensors closed, alarm armed_stay, exterior locks never auto-unlocked by policy.",
            trace: "ha_list_entities(domain=\"binary_sensor\")\n  → front_door closed · garage_door closed\nha_get_state(entity_id=\"alarm_control_panel.home\")\n  → armed_stay\nha_list_entities(domain=\"lock\")\n  → all engaged · cap.locks.exterior = never"
          };
        }
        if (/light|lights|dim|bright/.test(t)) {
          return {
            body: "Great room lights are on at 42%. I can stage scene.evening_host or adjust brightness — interior lighting is Always allowed.",
            trace: "ha_list_entities(domain=\"light\", area=\"great room\")\n  → light.great_room = on (brightness 108)\nha_list_services(domain=\"light\")\n  → turn_on · turn_off · toggle"
          };
        }
        if (/temp|warm|cool|climate|thermostat|setback/.test(t)) {
          return {
            body: "West wing is 70.1°F vs 68°F target, unoccupied 3h+. Autonomous setback still needs your Ask grant.",
            trace: "ha_get_state(entity_id=\"climate.west_wing\")\n  → heat · current 70.1 · target 68\n// ha_call_service blocked until cap.climate.west_wing = always | grant"
          };
        }
        if (/energy|power|kwh|draw|usage/.test(t)) {
          return {
            body: "House draw is 2.4 kW — 12% below the 7-day baseline. Shelly Pro 3EM is local; no cloud path.",
            trace: "ha_get_state(entity_id=\"sensor.shelly_pro_3em_power\")\n  → 2400 W"
          };
        }
        if (/morning|routine/.test(t)) {
          return {
            body: "I can stage a morning routine: bedroom lights soft, climate to 72°F, kitchen speaker on. Confirm to execute.",
            trace: "planned:\nha_call_service(light.turn_on, light.primary_suite, {brightness:128})\nha_call_service(climate.set_temperature, climate.primary_suite, {temperature:72})\nha_call_service(media_player.turn_on, media_player.kitchen_speaker)"
          };
        }
        return {
          body: "Noted. Evaluating against local policy and live HA state — no data leaves the property for this request.",
          trace: "ha_list_entities() · scoped by active guardrails\negress · denied"
        };
      }

      function wireComposer(formId, listId) {
        var form = document.getElementById(formId);
        var list = document.getElementById(listId);
        if (!form || !list) return;
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var input = form.querySelector("input");
          var text = (input.value || "").trim();
          if (!text) return;
          var user = document.createElement("div");
          user.className = "msg user";
          user.innerHTML = '<div class="who">You</div><p></p><div class="time">just now</div>';
          user.querySelector("p").textContent = text;
          list.appendChild(user);
          input.value = "";
          list.scrollTop = list.scrollHeight;
          setTimeout(function () {
            var reply = agentReply(text);
            var agent = document.createElement("div");
            agent.className = "msg agent";
            agent.innerHTML = '<div class="who">Property Manager</div><p></p><div class="trace"></div><div class="time">local</div>';
            agent.querySelector("p").textContent = reply.body;
            agent.querySelector(".trace").textContent = reply.trace;
            list.appendChild(agent);
            list.scrollTop = list.scrollHeight;
          }, 450);
        });
      }
      wireComposer("composer-overview", "messages-overview");
      wireComposer("composer-manager", "messages-manager");
    })();
