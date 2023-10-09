# vocabelectron

node v16.20.2

electronvocabscan enables you to extract the vocabulary out of the pdf page before you read the page. so that it becomes easy for the reader to go forward

steps to launch

1. npm install

2. dev
   ---
	termnal one : npm run start 
	termnal two : npm run start-electron

or

2. prod
   ----
	terminal one : npm run start-electron

IMPORTANT
---------
electron/grpcexec/pydist/cli/
	The above directroy has a grpc server executable which runs as a childprocess of the electron main process.
	The name of the eecutable is cli and it runs at 50051.



main: path.resolve(__dirname, "../electron/main.js"),