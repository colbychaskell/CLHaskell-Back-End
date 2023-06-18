const cluster = require("cluster");

function startWorker() {
  const worker = cluster.fork();
  console.log(`CLUSTER: Worker ${worker.id} started`);
}

if (cluster.isMaster) {
  require("os").cpus().forEach(startWorker);

  // log any workers that disconnect and spawn replacement
  cluster.on("disconnect", (worker) =>
    console.log(`CLUSTER: Worker ${worker.id} disconnected from the cluster.`)
  );

  //when a worker dies, create a worker to replace it
  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `CLUSTER: Worker ${worker.id} died with exit ` +
        `code ${code} (${signal})`
    );
    startWorker();
  });
} else {
  const port = process.env.PORT || 443;
  require("./clhaskell.js")(port);
}
