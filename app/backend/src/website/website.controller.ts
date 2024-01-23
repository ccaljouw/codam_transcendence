import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class WebsiteController {
  @Get()
  @Redirect('http://localhost:3000', 301)
  redirectToExternalSite() {}
}
