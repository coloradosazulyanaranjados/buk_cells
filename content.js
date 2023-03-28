chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.request === "cells"){
      let comments = getAllComments(document.body)
      sendResponse(sortByKeys(comments));
    }
  }
);

function filterNone() {
  return NodeFilter.FILTER_ACCEPT;
}

function getAllComments(rootElem) {
  let comments = new Object();
  let iterator = document.createNodeIterator(rootElem, NodeFilter.SHOW_COMMENT, filterNone, false);
  let curNode;
  while (curNode = iterator.nextNode()) {
      let value = curNode.nodeValue;
      if (value.startsWith('\nclass_name')){
        let name =  value.match(/name:(.*)/)[1]
        let path = value.match(/path:\s+(.*)\n/)[1]
        comments[name] = path
      }
  }
  return comments;
}

function sortByKeys(obj) {
  return Object.keys(obj).sort().reduce(function (result, key) {
    result[key] = obj[key];
    return result;
  }, {});
}