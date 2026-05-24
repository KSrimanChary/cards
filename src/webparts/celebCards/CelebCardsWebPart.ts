import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'CelebCardsWebPartStrings';
import CelebrationCarousel from './components/celebrationHeader/CelebrationCarousel';
import { IEmployeeCelebration } from '../../models/IEmployeeCelebration';
import CelebrationService from '../../services/CelebrationService-GraphAPI';

export interface ICelebCardsWebPartProps {
  description: string;
  cardsToShow: number;
}

export default class CelebCardsWebPart extends BaseClientSideWebPart<ICelebCardsWebPartProps> {
  private _celebrationService: CelebrationService;
  private _celebrations: IEmployeeCelebration[] = [];

  public render(): void {
    const element: React.ReactElement<any> = React.createElement(
       CelebrationCarousel,
          {
            celebrations: this._celebrations,
            cardsToShow: Number(this.properties.cardsToShow) || 3
          }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    try {
      // Initialize the service with the current service scope
      this._celebrationService = this.context.serviceScope.consume(CelebrationService.serviceKey);
      
      // Fetch today's celebrations
      this._celebrations = await this._celebrationService.getTodaysCelebrations();
      
      console.log(`Loaded ${this._celebrations.length} celebrations for today`);
      
      // Re-render with the fetched data
      this.render();
      
      return this._getEnvironmentMessage().then(message => {
        // Environment message handling (optional)
      });
    } catch (error) {
      console.error('Error initializing CelebCardsWebPart:', error);
      // Continue with empty array if there's an error
      this._celebrations = [];
      this.render();
    }
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { 
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }


    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
             groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),

                PropertyPaneTextField('cardsToShow', {
                  label: 'Number of cards visible in carousel'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
