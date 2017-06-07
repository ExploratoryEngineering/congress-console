#!groovy
pipeline {
  agent any
  stages {
    stage('Initiate job') {
      steps {
        checkout scm
        sh 'npm install'
      }
    }
    stage('Testing project') {
      steps {
        sh 'npm run test:jest'
        sh 'npm run test:lesshint'
        sh 'npm run test:tslint'
        sh 'npm run test:retire'
      }
    }
    stage('Building project') {
      steps {
        sh 'npm run build:prod'
      }
    }
  }
  post {
    success {
      publishHTML (target: [
        allowMissing: false,
        alwaysLinkToLastBuild: false,
        keepAll: true,
        reportDir: 'test/coverage-jest',
        reportFiles: 'index.html',
        reportName: "LCov Report"
      ])
    }
  }
}
