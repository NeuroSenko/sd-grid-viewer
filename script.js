async function setupImagesConfig() {
  const configUrl = window.location.search
    ? new URLSearchParams(window.location.search).get('configUrl')
    : './config.json';

  const {
    title,
    pathPattern,
    labelRow,
    labelColumn,
    imageWidth,
    imageHeight,
    rows,
    columns,
  } = await fetch(configUrl).then((res) => res.json());

  const getXLabelFn = (x) => labelColumn.replace('{{label}}', x);
  const getYLabelFn = (y) => labelRow.replace('{{label}}', y);

  const getImagePath = (x, y) => {
    const n = x + y * columns.length;

    const fileFullName = pathPattern.replace('{{n}}', n + 1);

    return fileFullName;
  }

  const topHeadersNode = document.getElementById('topHeaders');
  columns.forEach((val) => {
    const headerNode = document.createElement('div');
    headerNode.className = 'top-headers__item';
    headerNode.innerText = getXLabelFn(val);

    topHeadersNode.appendChild(headerNode);
  });

  const leftHeadersNode = document.getElementById('leftHeaders');
  rows.forEach((val) => {
    const headerNode = document.createElement('div');
    headerNode.className = 'left-headers__item';
    headerNode.innerText = getYLabelFn(val);

    leftHeadersNode.appendChild(headerNode);
  });

  const imgContainerNode = document.getElementById('imgContainer')
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < columns.length; x++) {
      const imgNode = document.createElement('img');
      imgNode.loading = 'lazy';
      imgNode.draggable = false;
      imgNode.width = imageWidth;
      imgNode.height = imageHeight;
      imgNode.src = getImagePath(x, y);

      imgContainerNode.appendChild(imgNode);

    }
  }

  document.title = title;

  const appRootNode = document.getElementById('appRoot');
  appRootNode.style.setProperty('--imageWidth', imageWidth + 'px');
  appRootNode.style.setProperty('--imageHeight', imageHeight + 'px');
  appRootNode.style.setProperty('--gridColumnsConfig', `repeat(${columns.length}, ${imageWidth}px)`);
}

function setupHeadersScroll() {
  const appRootNode = document.getElementById('appRoot');
  const topHeadersNode = document.getElementById('topHeaders');
  const leftHeadersNode = document.getElementById('leftHeaders');


  setInterval(() => {
    leftHeadersNode.style.transform = `translateY(-${appRootNode.scrollTop}px)`
    topHeadersNode.style.transform = `translateX(-${appRootNode.scrollLeft}px)`
  }, 10);
}

function setupMouseScroll() {
  const ele = document.getElementById('appRoot');

  let pos = { top: 0, left: 0, x: 0, y: 0 };

  const mouseMoveHandler = function (e) {
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    ele.scrollTop = pos.top - dy;
    ele.scrollLeft = pos.left - dx;
  };

  const mouseDownHandler = function (e) {
    pos = {
      left: ele.scrollLeft,
      top: ele.scrollTop,
      x: e.clientX,
      y: e.clientY,
    };

    ele.style.cursor = 'grabbing';

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  const mouseUpHandler = function () {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);

    ele.style.cursor = 'grab';
  };

  document.addEventListener('mousedown', mouseDownHandler);
}

setupImagesConfig();
setupHeadersScroll();
setupMouseScroll();