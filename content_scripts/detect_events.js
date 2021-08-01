function extractHostname(url) {
  var hostname;
  if (url.indexOf("//") > -1) {
    hostname = url.split('/')[2];
  }
  else {
    hostname = url.split('/')[0];
  }
  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];

  return hostname;
}

function extractRootDomainNoExt(url) {
  var domain = extractHostname(url),
      splitArr = domain.split('.'),
      arrLen = splitArr.length;

  if (arrLen == 2) {
    domain = splitArr[0]
  }
  else if (arrLen > 2) {
    domain = splitArr[arrLen - 2];
    //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
    if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
      domain = splitArr[arrLen - 3];
    }
  }
  return domain;
}

function getContractName(hostname) {
  let domainNoExt = extractRootDomainNoExt(hostname);
  return domainNoExt.charAt(0).toUpperCase() + domainNoExt.slice(1);
}

async function getContract(contractName) {
  //TODO: What's the best way of getting the hostname here?
  let contract = await fetch(`${window.location.origin}/v1/api/contract/load/${contractName}`)
  return await contract.json();
}

async function getNodePublicKey() {
  //TODO: Is this the public key we want to filter notifications?
  let publicKeyData = await fetch(`${window.location.origin}/v1/api/wallet/publicKey`)
  let publicKey = await publicKeyData.json();
  return publicKey.data.publicKey;
}

(async () => {
  // let point = window.wrappedJSObject.point;
  // let ping = await point.status.ping();
  // console.log('omega255', point.status);
  let hostname = window.location.hostname;
  let contractName = getContractName(hostname);
  let publicKey = await getNodePublicKey();
  let contract = await getContract(contractName);
  let abi = contract.data.abi;
  let address = contract.data.address;
  let events = [];
  abi.forEach(elt => {
    if (elt.type == "event") {
      let subObj = {};
      subObj.name = elt.name;
      subObj.type = elt.type;
      subObj.contract = contractName;
      subObj.address = address;
      subObj.host = window.location.hostname;
      subObj.options = {
	filter: {to: publicKey},
      };
      events.push(subObj);
    }
  });
  console.log('omega256', events)
  return events;
}
)();
