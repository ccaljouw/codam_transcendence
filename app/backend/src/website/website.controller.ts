import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class WebsiteController {
  @Get()
  @ApiOperation({ summary: '(Redirects to frontend at http://localhost:3000)'})
  @Redirect('http://localhost:3000', 301)
  redirectToExternalSite() {}
}
