pipeline {
  // agent  { label 'win-local' }
  agent {
    docker {
      image 'node:12.16.1-slim'
    }
  }

  triggers {
     cron(env.BRANCH_NAME == 'master' ? 'H 22 * * 1-5' : '')
  }

  stages {

    stage('Build') {
      steps {
        ansiColor("xterm") {
	        echo "Running build ${env.BUILD_ID} on ${env.JENKINS_URL}"
          sh 'npm i'
	      }
      }
    }

    stage('Test') {
      steps {
        script{
          ansiColor("xterm") {
	          echo "Running build ${env.BUILD_ID} on ${env.JENKINS_URL}"
            sh 'npm test'
	        }
        }
      }
    }
  }

  post {
		always {
      publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: false, reportDir: 'mochawesome-report', reportFiles: 'mochawesome.html', reportName: 'Mocha Report', reportTitles: ''])
		}
  }

}
