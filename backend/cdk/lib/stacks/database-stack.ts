import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import type { Construct } from 'constructs';
import { appConfig, tableConfig } from '../../../shared/config';

export class DatabaseStack extends cdk.Stack {
  public readonly tables: Record<string, dynamodb.ITable>;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.tables = {
      users: dynamodb.Table.fromTableName(this, 'UsersTableRef', tableConfig.users),
      customers: dynamodb.Table.fromTableName(this, 'CustomersTableRef', tableConfig.customers),
      products: dynamodb.Table.fromTableName(this, 'ProductsTableRef', tableConfig.products),
      policies: dynamodb.Table.fromTableName(this, 'PoliciesTableRef', tableConfig.policies),
      payments: dynamodb.Table.fromTableName(this, 'PaymentsTableRef', tableConfig.payments),
      notifications: dynamodb.Table.fromTableName(this, 'NotificationsTableRef', tableConfig.notifications),
      subscriptions: dynamodb.Table.fromTableName(this, 'SubscriptionsTableRef', tableConfig.subscriptions),
    };

    new cdk.CfnOutput(this, 'Stage', { value: appConfig.stage });
  }
}
