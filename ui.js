// ui.js：操作面板与视图（原生 DOM，无弹窗）
import { render } from "./app.js";

export function mount(spec, parts) {
  parts.log.textContent = "每批上限 " + (spec.batch_max || 0) + "，超时间隔 " + (spec.gap || 0)
    + "，到达 " + (spec.arrivals || []).length + " 次。";

  function draw() {
    let view = null;
    try {
      view = render(spec);
    } catch (error) {
      parts.out.textContent = String(error && error.code ? error.code : error);
      parts.log.textContent = "跑不动：" + String(error && error.message ? error.message : error);
      return;
    }
    parts.out.textContent = JSON.stringify(view, null, 1);
    parts.stage.textContent = "";
    (view.batches || []).forEach(function (size, spot) {
      const row = document.createElement("div");
      row.className = "row";
      const head = document.createElement("span");
      head.textContent = "第 " + (spot + 1) + " 批";
      row.appendChild(head);
      const bar = document.createElement("span");
      bar.className = "bar";
      const fill = document.createElement("i");
      fill.style.width = Math.min(100, size * 25) + "%";
      bar.appendChild(fill);
      row.appendChild(bar);
      const mark = document.createElement("span");
      mark.className = "chip" + (spot + 1 === view.biggest_at ? " ok" : "");
      mark.textContent = size + " 条";
      row.appendChild(mark);
      parts.stage.appendChild(row);
    });
    parts.legend.textContent = "刷了 " + view.batch_count + " 批，最大 " + view.biggest + " 条，空转 "
      + view.idle + " 次";
    parts.log.textContent = view.count + " 次到达，收尾未刷 " + view.pending_end + " 条";
  }

  const arrivalInput = document.createElement("input");
  arrivalInput.type = "number";
  arrivalInput.value = "11";
  parts.controls.appendChild(arrivalInput);

  const runButton = document.createElement("button");
  runButton.className = "primary";
  runButton.textContent = "算批次";
  runButton.addEventListener("click", draw);
  parts.controls.appendChild(runButton);

  const addButton = document.createElement("button");
  addButton.textContent = "追加一个到达";
  addButton.addEventListener("click", function () {
    const next = Number(arrivalInput.value);
    spec.arrivals = (spec.arrivals || []).concat([Number.isFinite(next) ? Math.max(0, Math.round(next)) : 0]);
    draw();
  });
  parts.controls.appendChild(addButton);

  const dropButton = document.createElement("button");
  dropButton.textContent = "删最后一个到达";
  dropButton.addEventListener("click", function () {
    spec.arrivals = (spec.arrivals || []).slice(0, Math.max(0, (spec.arrivals || []).length - 1));
    draw();
  });
  parts.controls.appendChild(dropButton);

  const limitButton = document.createElement("button");
  limitButton.textContent = "上限加一";
  limitButton.addEventListener("click", function () {
    spec.batch_max = (spec.batch_max || 1) + 1;
    draw();
  });
  parts.controls.appendChild(limitButton);

  draw();
}
