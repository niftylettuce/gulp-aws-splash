
# Gulp AWS Splash

[![Circle CI][circleci-image]][circleci-url]
[![MIT License][license-image]][license-url]

**The open-source [LaunchRock][launchrock] alternative.  Build beautiful splash pages to collect emails &amp; more &ndash; primarily focused on _performance_ and _[rapid development][rapid-development]_.  This project is sponsored by [Clevertech][clevertech].**

[View the demo][demo]

## Default Components & Services*

This project is bundled with the following default components and services in mind:

* [Node.js][nodejs]
* [Eskimo][eskimo]
* [Jade][jade]
* [LESS][less]
* [Gulp][gulp]
* [Bower][bower]
* [Bootstrap][bootstrap]
* [FontAwesome][font-awesome]
* [jQuery][jquery]
* [Modernizr][modernizr]
* [HTML5 Boilerplate][h5bp]
* [Amazon CloudFront][aws-cf]
* [Amazon S3][aws-s3]
* [MailChimp][mailchimp]
* [CircleCI][circleci]

_* Note that you can swap out many of these components and services with your preferred alternatives._

## Development

Development ([and Deployment](#deployment)) is made simple thanks to [Gulp][gulp].  Follow these simple instructions for setting up this project locally:

1. Make sure you are using [Node.js][nodejs] version `>= 0.12`.

2. Either clone this repository (recommended) or download a ZIP locally:

  To clone locally (preferred approach):

  ```bash
  git clone git@github.com:niftylettuce/gulp-aws-splash.git
  ```

  Or, to download a ZIP locally:

  ```bash
  curl -o ~/gulp-aws-splash.zip https://github.com/niftylettuce/gulp-aws-splash/archive/master.zip
  ```

  If you downloaded the ZIP, then you'll need to extract it first of course.

3. Change your working directory in terminal to the project's (e.g. `cd ~/gulp-aws-splash/`).

4. Install NPM dependencies required for developing locally and deploying the project:

  ```bash
  npm install
  ```

  Also install `gulp` and `bower` globally if you have not yet already:

  ```bash
  npm install -g gulp bower
  ```

5. Configure `boot/config.js` with your Google Analytics, MailChimp, and Amazon Web Services credentials.

  _For Google Analytics:_

  1. Go to <https://www.google.com/analytics/web/> &rarr; Admin &rarr; Create New Account.

  2. Complete required fields in order to create a new account.

  3. Copy/paste the generated "Tracking ID" as the value of `googleAnalytics` in `boot/config.js`:

    ```diff
    -      googleAnalytics: env.GA || 'TODO',
    +      googleAnalytics: env.GA || '12345678',
    ```

  _For MailChimp:_

  1. Go to <http://mailchimp.com/> &rarr; Log in (or Sign up) &rarr; Create List.

  2. Complete required fields in order to create a new list.

  3. Go to the Lists &rarr; Select (select your newly created list) &rarr; Signup forms &rarr; Embedded forms.

  4. Copy/paste the generated `<form>` action attribute value as the value of `mailChimp.actionUrl` in `boot/config.js`:

    ```diff
          mailChimp: {
    -        actionUrl: env.MC_AU || 'TODO',
    +        actionUrl: env.MC_AU || '//johndoe.us0.list-manage.com/subscribe/post?u=123456789abcdefghijklmno&amp;id=1234567890',
    ```

  5. Copy/paste the generated `<input>` name attribute value as the value of `mailChimp.hiddenInputName` in `boot/config.js` (note that this `<input>` is inside of an `<div>` with `absolute` CSS positioning):

    ```diff
    -        hiddenInputName: env.MC_HIN || 'TODO'
    +        hiddenInputName: env.MC_HIN || 'm_4co51234b92a65zb2a52z0221_154363e5def'
          },
    ```

  _For Amazon Web Services:_

  1. Go to <https://console.aws.amazon.com/s3/home> &rarr; Create New Bucket.

  2. Click on the newly created bucket &rarr; Static Website Hosting &rarr; Enable Website Hosting.

  3. Set the value of Index Document to `index.html` and Error Document to `404.html`, then click Save.

  4. Modify `boot/config.js` with your newly created bucket name:

    ```diff
          params: {
    -        Bucket: env.AWS_BUCKET || 'TODO'
    +        Bucket: env.AWS_BUCKET || 'gulp-aws-splash'
          }
    ```

  5. Go to <https://console.aws.amazon.com/iam/home#security_credential> &rarr; Access Keys (Access Key ID and Secret Access Key) &rarr; Create New Access Key.

  6. Copy/paste the values of Access Key ID and Secret Access Key to `boot/config.js` (note that you will repeat yourself below, since `gulp-awspublish` and `gulp-cloudfront` call for different configurations):

    ```diff
          aws: {
    -        key: env.AWS_KEY || 'TODO',
    +        key: env.AWS_KEY || 'ZFIKXOJ1MKTNVTQ4VPAD',
    -        accessKeyId: env.AWS_KEY || 'TODO',
    +        accessKeyId: env.AWS_KEY || 'ZFIKXOJ1MKTNVTQ4VPAD',
    -        secret: env.AWS_SECRET || 'TODO',
    +        secret: env.AWS_SECRET || 'j4nIT6KSuuuk01g3q4y+eYsuxtIUvMuoyWTfGV86W',
    -        secretAccessKey: env.AWS_KEY || 'TODO',
    +        secretAccessKey: env.AWS_SECRET || 'j4nIT6KSuuuk01g3q4y+eYsuxtIUvMuoyWTfGV86W',
    ```

  7. Go to <https://console.aws.amazon.com/cloudfront/home> &rarr; Web &rarr; Get Started &rarr; Create Distribution.

  8. Complete required fields in order to create a new distribution
    * If you want to use your own domain name, then please fill out the value of Alternate Domain Names).

  9. Copy/paste the Distribution ID as the value for `aws.distributionId` in `boot/config.js`:

    ```diff
    -        distributionId: env.AWS_DI || 'TODO',
    +        distributionId: env.AWS_DI || 'UXCY8BV5VXPSL',
    ```

6. Run `gulp build`, which will build and bundle assets, then `gulp watch` to start watching changes you make locally to the project.  It should automatically open up <http://localhost:3000/> in your default browser for you as well (which is the default development URL).


## Deployment

### Manual

To manually publish changes to your project, simply run `gulp publish`.  That's all you have to do!

### Automated

If you'd like your project to automatically be built and published to Amazon when you `git push` to GitHub, then configure [CircleCI][circleci] for continuous integration:

1. Create a new repo on GitHub for your `gulp-aws-splash` project and push to it your locally checked out copy (ensure that the default `circle.yml` still exists in your project's root folder).
2. Log in to [CircleCI][circleci] and add the newly created repository
3. Create custom environment variables based off your configuration in `boot/config.js`.  Here is a list of all the required variables:

* `GA` - Google Analytics ID
* `MC_AU` - MailChimp Form Action URL
* `MC_HIN` - MailChimp Hidden Input Name
* `AWS_KEY` - AWS key
* `AWS_SECRET` - AWS secret
* `AWS_BUCKET` - AWS bucket
* `AWS_DI` - AWS distribution ID


## License

[MIT][license-url]


[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE
[nodejs]: http://nodejs.org/
[eskimo]: http://eskimo.io/
[gulp]: http://gulpjs.com/
[bower]: http://bower.io/
[bootstrap]: http://getbootstrap.com/
[font-awesome]: https://fortawesome.github.io/Font-Awesome/
[jquery]: https://jquery.com/
[modernizr]: http://modernizr.com/
[h5bp]: https://html5boilerplate.com/
[aws-cf]: https://aws.amazon.com/cloudfront/
[aws-s3]: https://aws.amazon.com/s3/
[mailchimp]: http://mailchimp.com/
[circleci]: https://circleci.com/
[jade]: http://jade-lang.com/
[less]: http://lesscss.org/
[launchrock]: https://www.launchrock.com/
[rapid-development]: http://blog.clevertech.biz/post/hyper-focused-projects
[clevertech]: http://clevertech.biz
[demo]: https://d1xuiu27pilsh9.cloudfront.net/
[circleci-image]: https://img.shields.io/circleci/project/niftylettuce/gulp-aws-splash.svg?style=flat
[circleci-url]: https://circleci.com/gh/niftylettuce/gulp-aws-splash/tree/master
