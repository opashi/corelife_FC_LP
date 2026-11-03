document.addEventListener("DOMContentLoaded", () => {
  // スクロール時に要素をふわっと表示
  const targets = document.querySelectorAll(
    ".problem-item, .future-grid article, .difference-list article, .reason-card, .course-grid article, .school-card"
  );
  targets.forEach((el) => el.classList.add("js-reveal"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach((el) => observer.observe(el));
  } else {
    targets.forEach((el) => el.classList.add("is-visible"));
  }

  // ページ内リンクをスムーズに移動
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});



(function () {
  const root = document.getElementById("salesSimulation");
  if (!root) return;

  // 加盟後の固定条件
  const FIXED = {
    contract: 80,
    repeat: 85,
    price: 8800,
    monthlyNew: 6,
    months: 12
  };

  const inputIds = [
    "currentSales",
    "currentCustomers",
    "currentPrice",
    "currentRepeat",
    "currentNew",
    "currentContract"
  ];

  const resultIds = [
    "resultSales",
    "resultCustomers",
    "resultPrice",
    "resultRepeat",
    "resultNew",
    "resultContract"
  ];

  const get = id => root.querySelector("#" + id);

  const format = value =>
    Math.round(value).toLocaleString("ja-JP");

function clearResults() {
  const zeroResults = {
    resultSales: "0円",
    resultCustomers: "0人",
    resultPrice: "0円",
    resultRepeat: "0%",
    resultNew: "0人",
    resultContract: "0%"
  };

  Object.entries(zeroResults).forEach(([id, value]) => {
    const element = get(id);
    if (element) element.textContent = value;
  });

  const summaryCurrent = get("summaryCurrent");
  const summaryFuture = get("summaryFuture");
  const summaryGrowth = get("summaryGrowth");

  if (summaryCurrent) summaryCurrent.textContent = "0円";
  if (summaryFuture) summaryFuture.textContent = "0円";
  if (summaryGrowth) summaryGrowth.textContent = "0%";
}

  function calculate() {
    // 1項目でも空欄なら計算しない
    const hasEmpty = inputIds.some(id => {
      const input = get(id);
      return !input || input.value.trim() === "";
    });

    if (hasEmpty) {
      clearResults();
      return;
    }

    // 現在の数値
    const currentSales = Number(get("currentSales").value);
    const currentCustomers = Number(get("currentCustomers").value);
    const currentPrice = Number(get("currentPrice").value);
    const currentRepeat = Number(get("currentRepeat").value);
    const currentNew = Number(get("currentNew").value);
    const currentContract = Number(get("currentContract").value);

    // 数値として入力されていない場合も計算しない
    const values = [
      currentSales,
      currentCustomers,
      currentPrice,
      currentRepeat,
      currentNew,
      currentContract
    ];

    if (values.some(value => !Number.isFinite(value))) {
      clearResults();
      return;
    }

    // 1年後の数値
    const futureNew =
      currentNew + FIXED.monthlyNew;

    const futureCustomers =
      currentCustomers +
      FIXED.monthlyNew *
      FIXED.repeat / 100 *
      FIXED.months;

    const futurePrice = FIXED.price;
    const futureRepeat = FIXED.repeat;
    const futureContract = FIXED.contract;

    // 売上 = 顧客数 × 平均単価
    const futureSales =
      futureCustomers * futurePrice;

    // 比較結果
    const results = {
      resultSales: format(futureSales) + "円",
      resultCustomers: format(futureCustomers) + "人",
      resultPrice: format(futurePrice) + "円",
      resultRepeat: futureRepeat + "%",
      resultNew: format(futureNew) + "人",
      resultContract: futureContract + "%"
    };

    Object.entries(results).forEach(([id, value]) => {
      const element = get(id);
      if (element) element.textContent = value;
    });

    // サマリー表示
    get("summaryCurrent").textContent =
      format(currentSales) + "円";

    get("summaryFuture").textContent =
      format(futureSales) + "円";

    const growthRate = currentSales > 0
      ? (futureSales / currentSales - 1) * 100
      : 0;

    get("summaryGrowth").textContent =
      (growthRate > 0 ? "+" : "") +
      growthRate.toFixed(1) + "%";
  }

  // 入力変更時に自動計算
  inputIds.forEach(id => {
    const input = get(id);
    if (input) {
      input.addEventListener("input", calculate);
    }
  });

  // 初期表示
  calculate();

})();
